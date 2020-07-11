import geojson as gj
import pandas as pd

cleanData = pd.read_csv(r"C:\Users\Mjche\Documents\GroupProject\EconomicFreedomProject\cleanData.csv")
df = cleanData[["Country Name", "World Rank"]]
countriesToChange = {"United States of America":"United States", "American Samoa": "Samoa", "The Bahamas":"Bahamas", "Brunei":"Brunei Darussalam",
                        "Ivory Coast":"Côte d'Ivoire", "Democratic Republic of the Congo":"Congo, Democratic Republic of the Congo",
                        "Republic of Congo":"Congo, Republic of", "Federated States of Micronesia":"Micronesia", "Hong Kong S.A.R.": "Hong Kong",
                        "Republic of Serbia":"Serbia","Sao Tome and Principe":"São Tomé and Príncipe", "United Republic of Tanzania":"Tanzania"}

df.loc[df["Country Name"] == "Congo, Republic of"]
with open (r"C:\Users\Mjche\Documents\GroupProject\EconomicFreedomProject\countries.geojson") as f:
    geo = gj.load(f)
​
ci_df = df.set_index("Country Name")
​
as_list = ci_df.index.tolist()
​
for key, value in countriesToChange.items():
    idx = as_list.index(value)
    as_list[idx] = key
as_list[156] = "Taiwan"
ci_df.index = as_list


new_geo = geo
geo_features = []
missed = 0
made=0
for index in range(len(new_geo['features'])):
    country = new_geo['features'][index]['properties']['ADMIN']
    # country = ci_df.index
    try:
        rank = ci_df.loc[country].values[0]
        new_geo['features'][index]['properties']['rank'] = int(rank)
        made += 1
    except KeyError:
        print(f"Could not find country: {country}")
        missed += 1
    geometry = new_geo['features'][index]['geometry']
    properties = new_geo['features'][index]['properties']
    geo_features.append(gj.Feature(geometry=geometry, properties=properties))
print(missed)
print(made)

len(geo_features)
geo_export = gj.FeatureCollection(geo_features)

with open("./test3.geojson", "w") as f:
    gj.dump(geo_export, f)


    
