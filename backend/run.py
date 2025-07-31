# run.py

from app import create_app

app = create_app()

if __name__ == '__main__':
    # O comando `flask run` já usa o app factory,
    # então este bloco é principalmente para execução direta com `python run.py`
    app.run(debug=True)