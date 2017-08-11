# imports - standard imports
import os

# imports - third-party imports
import addict
from flask import request, jsonify

# imports - module imports
from candis.config              import CONFIG
from candis.util                import json_load
from candis.resource            import R
from candis.app.server.app      import app
from candis.app.server.response import Response

@app.route(CONFIG.App.Routes.API.Featselect.METHODS, methods = ['GET', 'POST'])
def fmethods():
    response  = Response()

    schema    = addict.Dict(CONFIG.Pipeline.schema)
    methods   = schema.feature_selection

    response.set_data(methods)

    dict_     = response.to_dict()
    json_     = jsonify(dict_)
    code      = response.code

    return json_, code
