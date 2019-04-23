from __future__ import print_function # In python 2.7
from flask import Flask, render_template, json, request, session
from apiclient import errors
from apiclient import http

import re
import sys
import os
import flask
import requests
import const
import diversity_score_model as dsm
import finance_model as fm
import pandas as pd
import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery
from apiclient import errors
from apiclient import http
import time

if sys.version_info[0] < 3:
    from StringIO import StringIO
else:
    from io import StringIO

CLIENT_SECRETS_FILE = "client_secret.json"

# Scope: read only from drive
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
API_SERVICE_NAME = 'drive'
API_VERSION = 'v2'

app = Flask(__name__)
app.secret_key = os.environ["DIVERSITY_GOOGLE_API_KEY"]
folderid = 'Diversity'

def csv_string_to_df(string):
    string_io = StringIO(string)
    df = pd.read_csv(string_io)
    df.columns = map(str.lower, df.columns)
    return df

def get_file_wrapper(service, file_id):
  content = service.files().get_media(fileId=file_id).execute()
  content = content.decode("utf-8") if type(content) == bytes else content
  content = content.strip()
  return content

'''
This function finds the csv from the selected folder id. It returns the contents of that folder as a list

Returns:
    ([str], pd.DataFrame)
'''
def get_diversity_dictionary(service, folder_id):
  page_token = None
  counter = 0
  while True:
    print("Counter: {}".format(counter))
    counter += 1
    try:
      param = {}
      if page_token:
        param['pageToken'] = page_token
      children = service.children().list(folderId=folder_id, **param).execute()
      count = 0
      dictcont = []
      fincont = []
      for child in children.get('items', []):
        #print child
        file = service.files().get(fileId=child['id']).execute()
        # Check if file is dictionary
        if file['fileExtension'] == "csv":
          print(file['title'])
          if file['title'].find('dict') != -1:
            print("here")
            content = get_file_wrapper(service, child["id"])
            content = content.replace("\n", ",").split(",")
            dictcont = content
            count += 1
          if file['title'].find('finan') != -1:
            content = get_file_wrapper(service, child["id"])
            content = csv_string_to_df(content)
            fincont = content
            count += 1
          if count == 2:
            return dictcont,fincont
          #return content
        else:
          print("SCOREFILE")
      page_token = children.get('nextPageToken')
      if not page_token:
        break
    except errors.HttpError as error:
      print('An error occurred: %s' % error)
      break


'''
  This function goes through the the files within the folder passed in
  and it in turn pulls out all text documents from the folder and adds them
  to a dictionary where the key is the company name and the value is the document's text content
'''
def get_document_collection(service, folder_id):
	compdict = {}
	page_token = None
	while True:
		try:
			param = {}
			if page_token:
				param['pageToken'] = page_token
			children = service.children().list(
				folderId=folder_id, **param).execute()
			for child in children.get('items', []):
				#print child
				file = service.files().get(fileId=child['id']).execute()
				# Check if file is dictionary
				if 'fileExtension' in file and file['fileExtension'] == "txt":
					comp_name = file['title']
					content = get_file_wrapper(service, child["id"])
					content = dsm.tokenize(content)
					content = dsm.tokenized_to_ngram(content, 2)
					compdict[comp_name] = content
			page_token = children.get('nextPageToken')
			if not page_token:
				break
		except errors.HttpError as error:
			print('An error occurred: %s' % error)
			break
	return compdict


def credentials_to_dict(credentials):
  return {'token': credentials.token,
          'refresh_token': credentials.refresh_token,
          'token_uri': credentials.token_uri,
          'client_id': credentials.client_id,
          'client_secret': credentials.client_secret,
          'scopes': credentials.scopes}


@app.route("/")
def api_home():
  return render_template("home.html", DEVELOPER_KEY = app.secret_key)

# going to change this to a function to change the doc directory
@app.route("/upload_folder", methods = ["POST","GET"])
def upload_folder():
    d_content  = request.form
    d_content = d_content.to_dict()
    fid = d_content['folder']
    flask.session['fid'] = fid
    #folderid = ''.join(d_content['folder'])
    #print(folderid)

    return 'response'

#authorize route, copied from google's flask tutorial
@app.route('/authorize')
def authorize():
  # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow steps.
  flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
      CLIENT_SECRETS_FILE, scopes=SCOPES)

  flow.redirect_uri = flask.url_for('oauth2callback', _external=True)

  authorization_url, state = flow.authorization_url(
      # Enable offline access so that you can refresh an access token without
      # re-prompting the user for permission. Recommended for web server apps.
      access_type='offline',
      # Enable incremental authorization. Recommended as a best practice.
      )

  # Store the state so the callback can verify the auth server response.
  flask.session['state'] = state

  return flask.redirect(authorization_url)


@app.route("/methods")
def api_methods():
	return render_template("methods.html")


#oath route, called when the user isn't currently logged into a drive account
@app.route('/oauth2callback')
def oauth2callback():
  # Specify the state when creating the flow in the callback so that it can
  # verified in the authorization server response.
  state = flask.session['state']

  flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
      CLIENT_SECRETS_FILE, scopes=SCOPES, state=state)
  flow.redirect_uri = flask.url_for('oauth2callback', _external=True)

  # Use the authorization server's response to fetch the OAuth 2.0 tokens.
  authorization_response = flask.request.url
  flow.fetch_token(authorization_response=authorization_response)

  # Store credentials in the session.
  # ACTION ITEM: In a production app, you likely want to save these
  #              credentials in a persistent database instead.
  credentials = flow.credentials
  flask.session['credentials'] = credentials_to_dict(credentials)

  return flask.redirect(flask.url_for('api_generate_scores'))


# this route pulls files from the drive and generates the scores
@app.route("/results", methods=['GET', 'POST'])
def api_generate_scores():
  if 'credentials' not in flask.session:
    return flask.redirect('authorize')
  credentials = google.oauth2.credentials.Credentials(**flask.session['credentials'])

  drive = googleapiclient.discovery.build(API_SERVICE_NAME, API_VERSION, credentials=credentials)

  folderid = flask.session['fid']
  moddate = drive.files().get(fileId=folderid).execute()['modifiedDate']
  print(moddate)
  '''
  files = drive.files().list().execute()
    folderid = ''
    for item  in files['items']:
      if item['title'] == 'Diversity':
         folderid = item['id']'''

  diversity_dictionary, financial_df = get_diversity_dictionary(drive,folderid)


  document_collection = get_document_collection(drive,folderid)

  diversity_scores_df = dsm.get_collection_diversity_scores(diversity_dictionary, document_collection.items())
  diversity_scores_mean = diversity_scores_df.mean()
  diversity_scores_std = diversity_scores_df.std()

  merged = pd.merge(diversity_scores_df, financial_df, on=const.CUSIP_COL)
  print(merged.head())
  print(financial_df.head())
  diversity_and_hrc_correlation = fm.get_pearson_correlation(merged[const.HRC_COL], merged[const.SCORE_COL])
  rounded_corr = (round(diversity_and_hrc_correlation[0],2),round(diversity_and_hrc_correlation[1],2))
  financial_scores_df = fm.get_dataframe_pearson_correlations(financial_df, diversity_scores_df)
  #re.sub("[^\d\.]", "", diversity_scores_mean)
  diversity_scores_mean = diversity_scores_mean.values
  diversity_scores_std = diversity_scores_std.values
  diversity_scores_mean[0] = round(diversity_scores_mean[0],2)
  diversity_scores_std[0] = round(diversity_scores_std[0],2)
  return render_template("results.html",
  					resultsJSON = diversity_scores_df.to_json(),
  					diversity_scores_mean = diversity_scores_mean,
  					diversity_scores_std = diversity_scores_std,
  					diversity_and_hrc_correlation = rounded_corr,
  					finance_results_JSON = financial_scores_df.to_json()
  					)

if __name__ == "__main__":
  os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
  app.run('localhost',8000,debug=True)
