from flask import Flask
from .vercel_kv import KV
from datetime import datetime


app = Flask(__name__)

@app.route("/api/python")
def hello_world():
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    kv = KV()
    kv.set(key="user:curtime", value=current_time)
    return "<p>Hello, World!</p>"

