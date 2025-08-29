from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def IndexLanding():
    return render_template('IndexLanding.html')
', methods=['GET', 'POST'])

def login():
    if request.method == 'POST':
        username = request.form.get('login-user')  
        password = request.form.get('login-pass') 
        print(f"Usuário: {username}, Senha: {password}")
        return "Login processado!"
    return render_template('Login.html')

if __name__ == '__main__':
    app.run(debug=True)
