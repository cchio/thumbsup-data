from flask import Flask, request
from ._vercel_kv import KV
from datetime import datetime


app = Flask(__name__)

@app.route("/api/py/python")
def hello_world():
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    kv = KV()
    # Set by accessing http://localhost:3000/api/py/python?user_id=123123
    user_id = request.args.get('user_id', type = str)
    if user_id is not None:
      kv.set(key=_get_user_kv_key(user_id, 'prompt_time'), value=current_time)
    return "<p>Hello, World!</p>"


def _get_user_kv_key(user_id, element_name):
    return f"u:{user_id}:{element_name}"
    
