from flask import Blueprint, render_template, redirect, url_for, jsonify, session
import sqlite3

IMAGE_DB_PATH = './app/database/user_images.db'
user_bp = Blueprint('user',__name__)

@user_bp.route('/home')
def home():
    return render_template('User/user_home.html')

@user_bp.route('/about')
def about_default():
    return redirect(url_for('main.web.user.home', _anchor='about_us'))

@user_bp.route('/about/<person>')
def about(person=None):
    if person == 'tirthraj':
        IMAGE_URL = url_for('static', filename='css/User/img/tirthraj_mahajan.jpeg')
        NAME = 'TIRTHRAJ MAHAJAN'
        DESCRIPTION = """
              Tirthraj Mahajan is a skilled web developer handling both front-end and back-end tasks for Scalp Smart. He's like the architect of our website, making sure everything looks great and works smoothly.
              <br><br>
              With his exceptional skills, he single-handedly developed the entire UI for the website. From crafting the layout to ensuring seamless navigation
              <br><br>
              His proficiency in Flask and SQL shines through as he seamlessly integrates machine learning models into the website and meticulously designs API endpoints.
        """
        LINKEDIN = 'https://www.linkedin.com/in/tirthraj-mahajan-909497258/'
        GITHUB = 'https://github.com/tirthraj07'
        INSTAGRAM = 'https://www.instagram.com/tirthraj07/'

        return render_template('User/user_aboutus.html', IMAGE_URL=IMAGE_URL, NAME=NAME, DESCRIPTION=DESCRIPTION, LINKEDIN=LINKEDIN, GITHUB=GITHUB, INSTAGRAM=INSTAGRAM)


    elif person == 'advait':
        IMAGE_URL = url_for('static', filename='css/User/img/advait_joshi.jpeg')
        NAME = 'ADVAIT JOSHI'
        DESCRIPTION = """
            Advait Joshi is our go-to expert for all things AI and Machine Learning at Scalp Smart. With his innovative approach and deep understanding of computer vision algorithms, Advait has played a pivotal role in developing specialized models for detecting different stages of baldness. 
            <br><br>
            But his expertise doesn't stop there. Advait is also the mastermind behind Scalp Smart's AI-powered chatbot, providing users with valuable insights and assistance on scalp health and related queries. His dedication to pushing the boundaries of technology ensures that Scalp Smart remains at the forefront of innovation and reliability.
        """
        LINKEDIN = 'https://www.linkedin.com/in/joshiadvait/'
        GITHUB = 'https://github.com/adv-AI-t'
        INSTAGRAM = 'https://www.instagram.com/i_advait_j/'

        return render_template('User/user_aboutus.html', IMAGE_URL=IMAGE_URL, NAME=NAME, DESCRIPTION=DESCRIPTION, LINKEDIN=LINKEDIN, GITHUB=GITHUB, INSTAGRAM=INSTAGRAM)


    elif person == 'amey':
        IMAGE_URL = url_for('static', filename='css/User/img/amey_kulkarni.jpeg')
        NAME = 'AMEY KULKARNI'
        DESCRIPTION = """
            Amey Kulkarni is the driving force behind bringing Scalp Smart to your mobile device. With expertise in mobile app development using Flutter, Amey transforms our concepts into a polished and user-friendly application. He meticulously designs the app's interface, ensuring a seamless and visually appealing experience for our users. 
            <br><br>
            Additionally, Amey plays a crucial role in database design and management. Amey implements a schema that seamlessly integrates with our backend infrastructure. He leverages his knowledge of Firebase to design a flexible and efficient database architecture that accommodates the dynamic needs of our growing user base.
        """
        LINKEDIN = 'https://www.linkedin.com/in/amey-amit-kulkarni/'
        GITHUB = 'https://github.com/ameyk2004/'
        INSTAGRAM = 'https://www.instagram.com/_ameyx__/'

        return render_template('User/user_aboutus.html', IMAGE_URL=IMAGE_URL, NAME=NAME, DESCRIPTION=DESCRIPTION, LINKEDIN=LINKEDIN, GITHUB=GITHUB, INSTAGRAM=INSTAGRAM)


    elif person == 'rinit':
        IMAGE_URL = url_for('static', filename='css/User/img/rinit_jain.jpeg')
        NAME = 'RINIT JAIN'
        DESCRIPTION = """
            Rinit Jain brings his expertise in machine learning to the forefront of Scalp Smart's development journey. As a key contributor to the development of datasets and prediction models, Rinit plays a crucial role in enhancing the accuracy and efficacy of the platform. 
            <br><br>
            His contributions extend to the creation of Scalp Smart's chatbot and the development of systems for capturing user images, essential for comprehensive analysis. Rinit's meticulous approach and dedication to innovation drive Scalp Smart's machine learning capabilities to new heights.   
        """
        LINKEDIN = 'https://www.linkedin.com/in/rinit-jain-09979925b/'
        GITHUB = 'https://github.com/RinitJain'
        INSTAGRAM = 'https://www.instagram.com/rinit_jain/'


        return render_template('User/user_aboutus.html', IMAGE_URL=IMAGE_URL, NAME=NAME, DESCRIPTION=DESCRIPTION, LINKEDIN=LINKEDIN, GITHUB=GITHUB, INSTAGRAM=INSTAGRAM)


    elif person == 'suvrat':

        IMAGE_URL = url_for('static', filename='css/User/img/suvrat_ketkar.jpeg')
        NAME = 'SUVRAT KETKAR'
        DESCRIPTION = """
            Suvrat Ketkar's expertise in machine learning and database management forms the backbone of Scalp Smart's data-driven approach. With a keen focus on training accurate models and developing comprehensive datasets, Suvrat ensures the platform's predictive capabilities are second to none. 
            <br><br>
            His contributions extend to the development of product databases and integration of Google Maps API, enhancing Scalp Smart's functionality and user experience. Suvrat's commitment to excellence and attention to detail propel Scalp Smart forward as a leader in scalp health analysis and product recommendation.
        """
        LINKEDIN = 'https://www.linkedin.com/in/suvrat-ketkar-418a8b273/'
        GITHUB = 'https://github.com/Suvrat-Ketkar'
        INSTAGRAM = 'https://www.instagram.com/suvratketkar_4/'


        return render_template('User/user_aboutus.html', IMAGE_URL=IMAGE_URL, NAME=NAME, DESCRIPTION=DESCRIPTION, LINKEDIN=LINKEDIN, GITHUB=GITHUB, INSTAGRAM=INSTAGRAM)

    return redirect(url_for('main.web.user.home', _anchor='about_us'))

@user_bp.route('/info')
def info():
    return render_template('User/user_info.html')

@user_bp.route('self-test')
def self_test():
    return render_template('User/user_selftest.html')


@user_bp.route('self-test/<method>')
def self_test_method(method):
    if method == 'capture':
        return render_template('User/user_selftest_capture.html')
    elif method == 'upload':
        return jsonify({'method':'upload'})
    else:
        return redirect(url_for('main.web.user.self_test'))
    

@user_bp.route('self-test/result')
def result():
    return render_template('User/user_selftest_result.html')