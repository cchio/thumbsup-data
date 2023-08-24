from flask import Flask, request
from ._vercel_kv import KV
from ._vercel_pg import PG
from datetime import datetime
import pandas as pd


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
    return f'<p>Hello, {user_id} World!</p>'


@app.route("/api/py/pgtest")
def pg_write_test():
    pg = PG()
    df = pd.DataFrame([10,20,30,40,50,60], columns=['Numbers'])
    user_id = request.args.get('user_id', type = str)
    filename = request.args.get('filename', type = str)
    table_name = f'{user_id}__{filename}'
    pg.write_df_to_table(table_name, df)
    return pg.get_table_schema(table_name)



def _get_user_kv_key(user_id, element_name):
    return f"u:{user_id}:{element_name}"
    
