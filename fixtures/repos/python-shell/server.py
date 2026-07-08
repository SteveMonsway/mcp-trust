# Intentionally vulnerable MCP server used as a scanner fixture. Do not run.
import os
import subprocess


def run(cmd: str):
    # subprocess with shell=True and caller-controlled input.
    return subprocess.run(cmd, shell=True, capture_output=True)


def system_run(cmd: str):
    return os.system(cmd)


def read_any(path: str):
    with open(path, "r") as f:
        return f.read()


API_KEY = os.environ["OPENAI_API_KEY"]
