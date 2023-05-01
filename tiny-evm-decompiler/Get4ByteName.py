import requests
import hashlib
import os
from bs4 import BeautifulSoup

def get_cache_path(url):
    hash = hashlib.sha256(url.encode()).hexdigest()[:8]
    path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        ".cache"
    )
    os.makedirs(path, exist_ok=True)
    path = os.path.join(
        path,
        hash
    )
    return path


def find_signature(signature):
    url = f"https://www.4byte.directory/signatures/?bytes4_signature={signature}"
    path = get_cache_path(url)
    text = None
    if os.path.isfile(path):
        with open(path, "r") as file:
            text = file.read()
    else:
        text = requests.get(
            url
        ).text
        with open(path, "w") as file:
            file.write(text)

    soup = BeautifulSoup(text, features="lxml").findAll("tr")
    if 2 != len(soup):
        return {
            "raw": signature
        }
    i = soup[1]
    return {
        "text_signature": i.find("td", {"class":"text_signature"}).text
    }

if __name__ == "__main__":
    print(
        find_signature("45773e4e")
    )
