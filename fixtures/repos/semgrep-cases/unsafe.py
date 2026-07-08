# Intentionally vulnerable MCP server fixture for the Semgrep AST rules.
# Exercises Python patterns the regex rules do NOT cover. Do not run.
import pickle
import yaml
import importlib


# MCP-SG-PY-002: dynamic code evaluation via the exec builtin.
def compute(expr):
    return exec(expr)


# MCP-SG-PY-003: unsafe deserialization (pickle.loads + yaml.load w/o SafeLoader).
def restore(blob):
    return pickle.loads(blob)


def parse_config(text):
    return yaml.load(text)


# MCP-SG-PY-005: dynamic import with a non-literal module name.
def load_plugin(name):
    return importlib.import_module(name)
