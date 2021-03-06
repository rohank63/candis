# imports - standard imports
import os

# imports - third-party imports
import addict
from flask import request, jsonify

# imports - module imports
from candis.config              import CONFIG
from candis.resource            import R
from candis.app.server.app      import app
from candis.app.server.response import Response

@app.route(CONFIG.App.Routes.API.Model.METHODS, methods = ['GET', 'POST'])
def mmethods():
    response  = Response()

    schema    = addict.Dict(CONFIG.Pipeline.schema)
    methods   = schema.model

    response.set_data(methods)

    dict_     = response.to_dict()
    json_     = jsonify(dict_)
    code      = response.code

    return json_, code
