from flask import Flask, render_template, session, redirect, url_for
from flask_session import Session

app = Flask(__name__)
app.secret_key = 'secret-key'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

@app.route('/')
def home():
    # Initialize high score if not set
    if 'high_score' not in session:
        session['high_score'] = 0
    return render_template("index.html", high_score=session['high_score'])

@app.route('/update_score/<int:score>', methods=['POST'])
def update_score(score):
    if score > session.get('high_score', 0):
        session['high_score'] = score
    return ('', 204)

@app.route('/reset')
def reset():
    session['high_score'] = 0
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)
