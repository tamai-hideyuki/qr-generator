import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1

config = {
    "host": "0.0.0.0",
    "port": 8000,
    "reload": True,
    "workers": workers,
}

