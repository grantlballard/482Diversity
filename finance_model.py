from scipy.stats import pearsonr
import pandas as pd

def get_pearson_correlation(list_1, list_2):
    """
    Parameters:
        list_1 -> [double]. List of values from first dataset
        list_2 -> [double]. List of values from second dataset
    Returns:
        (double, double). Pearson correlation coefficient and p-value of both datasets
    """
    if len(list_1) != len(list_2):
        raise ValueError("list_1 and list_2 must be the same length")
    return pearsonr(list_1, list_2)


def get_dataframe_pearson_correlations(financial_df, diversity_scores_df):
    """
    Parameters:
        financial_df     -> pandas.DataFrame. Company financial data
        diversity_scores -> pandas.DataFrame. Diversity scores for each company 
    Returns:
        pd.DataFrame. DataFrame with columns 'Financial_Statistic', 'Correlation', 'P_Value'
    """
    # Validate dataframes
    required_columns = ["CUSIP"]
    for col in required_columns:
        if col not in financial_df:
            raise ValueError("financial_df must have column {}".format(col))
        if col not in diversity_scores_df:
            raise ValueError("diversity_scores must have column {}".format(col))

    # Generate correlations
    results = []
    merged = pd.merge(diversity_scores_df, financial_df, on="CUSIP")
    merged = merged.drop(columns = ["CUSIP"])
    for col in merged:
        if col != "score":
            subset = merged[['score', col]].copy()
            subset[col] = subset[col].astype(float)
            subset = subset.dropna()
            correlation, p_val = get_pearson_correlation(subset['score'], subset[col])
            new_result = [col, correlation, p_val]
            results.append(new_result)
    results = pd.DataFrame(results, columns=['Financial_Statistic', 'Correlation', 'P_Value'])
    return results
