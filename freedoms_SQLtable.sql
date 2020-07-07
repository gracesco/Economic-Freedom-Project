CREATE TABLE freedoms (
	ID Int PRIMARY KEY,
	Country_Name VARCHAR(60) NOT Null,
	Region VARCHAR(30),
	World_Rank Int NOT Null,
	Region_Rank Int NOT Null,
    Score2019 numeric,
	Business_Freedom numeric,
	Labor_Freedom numeric,
	Monetary_Freedom numeric,
	Trade_Freedom numeric,
	Investment_Freedom numeric,
	Financial_Freedom numeric
);

