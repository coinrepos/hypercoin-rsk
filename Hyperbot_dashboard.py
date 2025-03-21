from flask import Flask, render_template, jsonify, request, send_from_directory
from web3 import Web3
import os
import threading
import logging
import jwt
import datetime
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Enable Logging
logging.basicConfig(level=logging.INFO)

# Connect to RSK Network
RSK_RPC_URL = "https://public-node.rsk.co"
w3 = Web3(Web3.HTTPProvider(RSK_RPC_URL))

# Check Connection
if not w3.is_connected():
    raise Exception("Failed to connect to RSK network")

# Wallet & Contract Settings
HYPERCOIN_CONTRACT = os.getenv("HYPERCOIN_CONTRACT")  
STAKING_CONTRACT = os.getenv("STAKING_CONTRACT")
EXCHANGE_CONTRACT = os.getenv("EXCHANGE_CONTRACT")
GOVERNANCE_CONTRACT = os.getenv("GOVERNANCE_CONTRACT")
BRIDGE_CONTRACT = os.getenv("BRIDGE_CONTRACT")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")

# Serve Static Files (Logo and Images)
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory("static", filename)

@app.route('/static/images/<path:filename>')
def serve_image_library(filename):
    return send_from_directory("static/images", filename)

@app.route('/')
def dashboard():
    return render_template('dashboard.html', theme="tailwind")

# Authentication System
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = data.get("user")
    if user:
        token = jwt.encode(
            {"user": user, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
            JWT_SECRET, algorithm="HS256"
        )
        return jsonify({"token": token})
    return jsonify({"error": "Unauthorized"}), 401

@app.route('/api/status')
def get_status():
    latest_block = w3.eth.block_number
    gas_price = w3.eth.gas_price
    return jsonify({
        "latest_block": latest_block,
        "gas_price": w3.from_wei(gas_price, 'gwei')
    })

@app.route('/api/balance/<address>')
def get_balance(address):
    balance = w3.eth.get_balance(address)
    return jsonify({"balance": w3.from_wei(balance, 'ether')})

@app.route('/api/user-portfolio/<address>')
def get_user_portfolio(address):
    return render_template('portfolio.html', address=address)

@app.route('/api/stake', methods=['POST'])
def stake_tokens():
    return render_template('stake.html')

@app.route('/api/liquidity')
def get_liquidity_info():
    return render_template('liquidity.html')

@app.route('/api/exchange/rate')
def get_exchange_rate():
    return render_template('exchange_rate.html')

@app.route('/api/governance/proposals')
def get_governance_proposals():
    return render_template('governance.html')

@app.route('/api/governance/votes/<proposal_id>')
def get_proposal_votes(proposal_id):
    return render_template('votes.html', proposal_id=proposal_id)

@app.route('/api/governance/executed')
def get_executed_proposals():
    return render_template('executed.html')

@app.route('/api/transactions')
def get_transaction_history():
    return render_template('transactions.html')

@app.route('/api/liquidity-graph')
def liquidity_graph():
    return render_template('liquidity_graph.html')

@app.route('/api/transactions-graph')
def transactions_graph():
    return render_template('transactions_graph.html')

@app.route('/api/bridge/btc-to-rbtc', methods=['POST'])
def bridge_btc_to_rbtc():
    return render_template('bridge.html')

# WebSocket Event for Live Updates
@socketio.on('connect')
def handle_connect():
    logging.info("Client connected")
    emit('message', {'data': 'Connected to real-time updates'})

@socketio.on('governance_update')
def handle_governance_update():
    emit('governance_update', {'data': 'New governance proposal detected'}, broadcast=True)

# Real-time notification system
def governance_listener():
    logging.info("Listening for governance updates...")
    pass

if __name__ == "__main__":
    threading.Thread(target=governance_listener, daemon=True).start()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
