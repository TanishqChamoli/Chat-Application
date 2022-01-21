from flask import Flask, render_template, request
from flask import jsonify
from userDB import *

app = Flask(__name__)

@app.route('/signup', methods=["POST"])
def signup():
    userData = request.get_json()
    output = create_user(userData)
    return output

@app.route('/login', methods=["POST"])
def login():
    userData = request.get_json()
    output = login_user(userData)
    return output

@app.route('/getConnections', methods=["POST"])
def getConnections():
    userData = request.get_json()
    output = getUserConnections(userData)
    return output

@app.route('/addConnection', methods=["POST"])
def addConnection():
    userData = request.get_json()
    output = addNewConnection(userData)
    return output

@app.route('/sendMessage', methods=["POST"])
def sendMessage():
    userData = request.get_json()
    output = insertMessage(userData)
    return output

# @app.route('/identical-api/<currid>',methods=["GET"])
# def newpage_api(currid):
#     return jsonify(search(currid))

# @app.route('/homologous-api/<currid>',methods=["GET"])
# def homologous_page_api(currid):
#     return jsonify(homologous(currid))

if __name__ == '__main__':
    app.run(debug=True)