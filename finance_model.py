from scipy.stats import pearsonr
import pandas as pd
import math
import const



def get_pearson_correlation(list_1, list_2):
    """
    Parameters:
        list_1 -> [double]. List of values from first dataset
        list_2 -> [double]. List of values from second dataset
    Returns:
        (double, double). Pearson correlation coefficient and p-value of both datasets
    """
    # Clean lists
    list_1 = list_1.astype(float)
    list_1 = list_1.dropna()
    list_2 = list_2.astype(float)
    list_2 = list_2.dropna()

    if len(list_1) != len(list_2):
        raise ValueError("Cannot perform pearson correlation on lists of different length.\nList 1{}\n\nList2{}".format(list_1, list_2))
    pearson, p_val = pearsonr(list_1, list_2)
    # if either std(list_1) or std(list_2) is 0, the pearson correlation is undefined. Instead of returning null, we return 0
    pearson = 0 if math.isnan(pearson) else pearson
    p_val = 0 if math.isnan(p_val) else p_val
    return (pearson, p_val)


def check_required_columns_exist(data_frame, required_columns):
    """
    Parameters:
        data_frame: pd.DataFrame
        required_columns: [string]. List of required columns in data_frame
    Returns:
        None
    Raises:
        ValueError if one of the required columns is not found
    """
    for col in required_columns:
        if col not in data_frame:
            raise ValueError("Required column {} not found in data frame:\n{}".format(col, data_frame.head()))


def get_dataframe_pearson_correlations(financial_df, diversity_scores_df):
    """
    Parameters:
        financial_df     -> pd.DataFrame. Company financial data
        diversity_scores -> pd.DataFrame. Diversity scores for each company
    Returns:
        pd.DataFrame. DataFrame with columns 'Financial_Statistic', 'Correlation', 'P_Value'
        Each row will have a financial statistic from the 'financial_df' DataFrame
        and its correlation with diversity scores.
    """
    # Clean dataframes
    financial_df.columns = map(str.lower, financial_df.columns)
    diversity_scores_df.columns = map(str.lower, diversity_scores_df.columns)

    # Validate dataframes
    required_columns = [const.CUSIP_COL]
    check_required_columns_exist(financial_df, required_columns)
    check_required_columns_exist(diversity_scores_df, required_columns)

    # Generate correlations
    results = []
    merged = pd.merge(diversity_scores_df, financial_df, on=const.CUSIP_COL)
    merged = merged.drop(columns = [const.CUSIP_COL])
    non_stat_columns = [const.COMP_NAME_COL, const.SCORE_COL, const.HRC_COL]
    for stat in merged:
        if stat not in non_stat_columns:
            # Prepare dataframe for scoring
            subset = merged[[const.SCORE_COL, const.HRC_COL, stat]].copy()
            subset[stat] = subset[stat].astype(float)
            subset[const.HRC_COL] = subset[const.HRC_COL].astype(float)
            subset[const.SCORE_COL] = subset[const.SCORE_COL].astype(float)
            subset = subset.dropna()

            # Get row values
            stat_mean = subset[stat].mean()
            stat_std = subset[stat].std()
            diversity_correlation, diversity_p_val = get_pearson_correlation(subset[const.SCORE_COL], subset[stat])
            hrc_correlation, hrc_p_val = get_pearson_correlation(subset[const.HRC_COL], subset[stat])

            # Append new row
            new_row = [stat, stat_mean, stat_std, diversity_correlation, diversity_p_val, hrc_correlation, hrc_p_val]
            new_row = [round(val, 2) if not isinstance(val, str) else val for val in new_row]
            results.append(new_row)
    results = pd.DataFrame(results, columns=['Financial_Statistic', 'Mean', 'Std', 'Diversity_Correlation', 'Diversity_P_Value', 'HRC_Correlation', 'HRC_P_Value'])
    return results
