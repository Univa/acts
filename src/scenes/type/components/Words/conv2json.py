import json

with open("words.txt", "r") as file:
    words = file.read()
    words = words.splitlines()
    json_raw = {"words": words}
    text = json.dumps(json_raw)

with open("words.json", "w") as file:
    file.write(text)
