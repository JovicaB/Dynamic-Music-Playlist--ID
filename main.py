from playlist_generator import InitialViewportPlaylist, DynamicPlaylistGenerator
from flask import Flask, render_template, request, jsonify
# from flask_cors import CORS
import json
import math
import random

application = Flask(__name__)
app = application
app.config['MIME_TYPES'] = {'.js': 'application/javascript'}
# CORS(app)

API_BASE = 'http://127.0.0.1:5000/'

selected_music_category = None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate_initial_List", methods=["POST"])
def initial_list():
    input_data = request.get_json()
    output_data = InitialViewportPlaylist(input_data).generator()
    return jsonify(output_data), 200

@app.route("/extend_playlist", methods=["POST"])
def add_songs():
    selected_music_category = request.get_json()
    if len(selected_music_category) == 2:
        primary = selected_music_category[0]
        secondary = selected_music_category[1] 
        playlist_generator = DynamicPlaylistGenerator(primary, secondary)
        extended_playlist = playlist_generator.generator()
    else:
        playlist_generator = DynamicPlaylistGenerator(selected_music_category)
        extended_playlist = playlist_generator.generator()
    print(extended_playlist)
    return jsonify(extended_playlist), 200

if __name__ == '__main__':
    host = API_BASE.split("//")[1].split(":")[0]
    port = int(API_BASE.split(":")[2].split("/")[0])
    # app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Set the cache timeout to 0
    # app.run(host='127.0.0.1', port=5000, debug=True)
    app.run(host=host, port=port, debug=True)