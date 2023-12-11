import xarray as xr


def read_netcdfs(path, latitude, longitude):
    # glob expands paths with * to a list of files, like the unix shell
    dataset = xr.open_dataset(path)
    dataset = dataset["hmax"].sel()
    return dataset


dataset = read_netcdfs("waves_2019-01-01.nc", 0, 0)

print(dataset)
