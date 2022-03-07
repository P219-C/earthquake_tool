from flask import Flask, render_template
from sqlalchemy import create_engine
import pandas as pd

# Database setup
db_name = "projectDB"
db_path = f"sqlite:///static/data/{db_name}.sqlite"


# Flask app setup
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/API/countries")
def countries():
    engine = create_engine(db_path)
    conn = engine.connect()
    countries_sql = pd.read_sql("SELECT * FROM countries", conn)
    countries_json = countries_sql.to_json(orient="records")
    return countries_json


@app.route("/API/earthquakes")
def earthquakes():
    engine = create_engine(db_path)
    # Connecting to the db
    conn = engine.connect()
    earthquakes_sql = pd.read_sql("SELECT * FROM earthquakes", conn)
    earthquakes_json = earthquakes_sql.to_json(orient = "records")
    return earthquakes_json

@app.route("/API/gdp")
def gdp():
    engine = create_engine(db_path)
    conn = engine.connect()
    gdp_sql = pd.read_sql("SELECT * FROM gdppc", conn)
    gdp_json = gdp_sql.to_json(orient = "records")
    return gdp_json

@app.route("/API/countries_earthquakes")
def countries_earthquakes():
    engine = create_engine(db_path)
    conn = engine.connect()
    countries_earthquakes_sql = pd.read_sql("SELECT * FROM countries INNER JOIN earthquakes ON earthquakes.country_id=countries.CountryCode", conn)
    countries_earthquakes_json = countries_earthquakes_sql.to_json(orient="records")
    return countries_earthquakes_json

@app.route("/API/countries_GDP")
def countries_GDP():
    engine = create_engine(db_path)
    conn = engine.connect()
    countries_GDP_sql = pd.read_sql("SELECT * FROM countries INNER JOIN gdppc ON gdppc.country_id=countries.CountryCode", conn)
    countries_GDP_json = countries_GDP_sql.to_json(orient="records")
    return countries_GDP_json


if __name__ == "__main__":
    app.run(debug=True)