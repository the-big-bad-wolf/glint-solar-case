import random
from flask import Flask, jsonify, request
from flask_cors import CORS
import xarray as xr

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["POST", "GET"])
def waveHeight():
    latitude = float(request.form["latitude"])
    longitude = float(request.form["longitude"])
    (hmax, unit) = read_netcdfs("waves_2019-01-01.nc", latitude, longitude)
    return jsonify(hmax=hmax, unit=unit)


def read_netcdfs(path: str, latitude: float, longitude: float):
    # glob expands paths with * to a list of files, like the unix shell
    dataset = xr.open_dataset(path)
    wave_heights = dataset["hmax"].sel(
        longitude=longitude, latitude=latitude, method="nearest"
    )
    hmax = float(wave_heights.max().values)
    unit = wave_heights.attrs["units"]
    dataset.close()
    wave_heights.close()
    return (hmax, unit)
