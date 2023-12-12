import xarray as xr
import math


# Denne filen er kun for å sjekke maks høyde for (0,0)
def read_netcdfs(path: str, latitude: float, longitude: float):
    dataset = xr.open_dataset(path)
    wave_heights = dataset["hmax"].sel(
        longitude=longitude, latitude=latitude, method="nearest"
    )
    unit = wave_heights.attrs["units"]
    if math.isnan(wave_heights.max().values):
        hmax = 0
    else:
        hmax = float(wave_heights.max().values)

    dataset.close()
    wave_heights.close()

    return (hmax, unit)


print(read_netcdfs("waves_2019-01-01.nc", 0, 0))
