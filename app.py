from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def IndexLanding():
    return render_template('IndexLanding.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('login-user')
        password = request.form.get('login-pass')
        print(f"Usuário: {username}, Senha: {password}")
        return "Login processado!"
    return render_template('Login.html')

    @app.route ('/cadastro', methos=['GET', 'POST'])
    def cadastro():
        return render_template ('Cadastro.html')
            

if __name__ == '__main__':
    app.run(debug=True)