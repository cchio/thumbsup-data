# KV Store 
# From https://github.com/bestK/python-vercel-kv/blob/main/src/vercel_kv.py
# Name prefixed with '_' to tell Vercel not to make it a serverless function.

import os
import requests
import json

from typing import Optional


class KVConfig:
    url: str
    rest_api_url: str
    rest_api_token: str
    rest_api_read_only_token: str


class Opts:
    ex: Optional[int]
    px: Optional[int]
    exat: None
    pxat: None
    keepTtl: None


class KV:
    """
    Wrapper for https://vercel.com/docs/storage/vercel-kv/rest-api
    """

    def __init__(self, kv_config: Optional[KVConfig] = None):
        if kv_config is None:
            url = os.environ.get("KV_DB_URL")
            rest_api_url = os.environ.get("KV_DB_REST_API_URL")
            rest_api_token = os.environ.get("KV_DB_REST_API_TOKEN")
            rest_api_read_only_token = os.environ.get("KV_DB_REST_API_READ_ONLY_TOKEN")
            if None in [url, rest_api_url, rest_api_token, rest_api_read_only_token]:
                raise Exception("_vercel_kv class missing required env variables.")
            
            self.kv_config = KVConfig()
            self.kv_config.url = url
            self.kv_config.rest_api_url = rest_api_url
            self.kv_config.rest_api_token = rest_api_token
            self.kv_config.rest_api_read_only_token = rest_api_read_only_token
        else:
            self.kv_config = kv_config

    def get_kv_conf(self):
        return self.kv_config

    def has_auth(self) -> bool:
        kv_config = KV.get_kv_conf()
        headers = {
            'Authorization': f'Bearer {self.kv_config.rest_api_token}',
        }
        resp = requests.get(self.kv_config.rest_api_url, headers=headers)
        return resp.json()['error'] != 'Unauthorized'

    def set(self, key, value, opts = None) -> bool:
        headers = {
            'Authorization': f'Bearer {self.kv_config.rest_api_token}',
        }

        url = f'{self.kv_config.rest_api_url}/set/{key}/{value}'

        if opts is not None and opts.ex is not None:
            url = f'{url}/ex/{opts.ex}'

        resp = requests.get(url, headers=headers)
        return resp.json()['result']

    def set_json(self, key, value) -> bool:
        headers = {
            'Authorization': f'Bearer {self.kv_config.rest_api_token}',
        }

        url = f'{self.kv_config.rest_api_url}/set/{key}'
        resp = requests.post(url, data=json.dumps(value), headers=headers)
        return resp.json()['result']

    def get(self, key) -> bool:
        headers = {
            'Authorization': f'Bearer {self.kv_config.rest_api_token}',
        }

        resp = requests.get(f'{self.kv_config.rest_api_url}/get/{key}', headers=headers)
        return resp.json()['result']