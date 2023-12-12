import math
from flask import Flask, jsonify, request
from flask_cors import CORS
import xarray as xr

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["POST"])
def waveHeight():
    latitude = float(request.form["latitude"])
    longitude = float(request.form["longitude"])
    (hmax, unit) = read_netcdfs("waves_2019-01-01.nc", latitude, longitude)
    return jsonify(hmax=hmax, unit=unit)


def read_netcdfs(path: str, latitude: float, longitude: float):
    dataset = xr.open_dataset(path)
    wave_heights = dataset["hmax"].sel(
        longitude=longitude, latitude=latitude, method="nearest"
    )

    unit = wave_heights.attrs["units"]  # Measurement unit of hmax
    if math.isnan(wave_heights.max().values):
        hmax = 0
    else:
        hmax = float(wave_heights.max().values)

    dataset.close()
    wave_heights.close()

    return (hmax, unit)
