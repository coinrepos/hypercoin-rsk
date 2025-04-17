from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import os
import logging

app = Flask(__name__, template_folder="templates", static_folder="static")
socketio = SocketIO(app, cors_allowed_origins="*")

# Root Route for localhost:5000
@app.route('/')
def home():
    return render_template('dashboard.html')

# Example API
@app.route('/api/status')
def status():
    return jsonify({"status": "✅ HyperBot API is running"})

# WebSocket event
@socketio.on("connect")
def handle_connect():
    emit("message", {"data": "📡 Connected to HyperBot socket"})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
