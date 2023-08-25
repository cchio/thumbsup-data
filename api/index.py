from flask import Flask, request
from ._vercel_kv import KV
from ._vercel_pg import PG
from datetime import datetime
import pandas as pd
import json


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
    file_name = request.args.get('file_name', type = str)
    table_name = _get_table_name(user_id, file_name)
    pg.write_df_to_table(table_name, df)
    return pg.get_table_schema(table_name)


@app.route("/api/py/add_table")
def add_table():
    '''
    Processes a new table, adding a snippet of data to prompt preamble and
    saving full data into PostgresDB.
    Called via: http://localhost:3000/api/py/add_table?user_id=123123&table_name=myab
    '''
    user_id = request.args.get('user_id', type=str)
    if user_id is None:
        return "user_id route parameter required", 400
    file_name = request.args.get('file_name', type=str)
    if file_name is None:
        return "file_name route parameter required", 400

    # Parse table to dataframe.
    d = {'col1': [1, 2], 'col2': [3, 4]} # Fix
    df = pd.DataFrame(data=d)            # Fix
    table_head = df.head().to_string()
    # print("PAYLOAD", table_head)

    # Save table header to prompt preamble.
    kv = KV()
    key = _get_user_kv_key(user_id, 'table_preambles')
    table_preambles = json.loads(kv.get(key) or '{}')
    # print("GOT", table_preambles)
    table_name = _get_table_name(user_id, file_name)
    table_preambles[table_name] = table_head
    res = kv.set_json(key=key, value=table_preambles)
    # print("SET", table_preambles, res)

    # Save full dataframe into Postgres DB.
    pg = PG()
    # print("WRITING TO DB", table_name, df)
    pg.write_df_to_table(table_name, df)
    return "<p>Success!</p>"


### Utility Functions
def _get_user_kv_key(user_id, element_name):
    return f"u:{user_id}:{element_name}"
    
def _get_table_name(user_id, file_name):
    return f'{user_id}__{file_name}'
