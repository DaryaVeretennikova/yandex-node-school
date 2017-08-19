let NyForm;

window.onload = () => {
  const inputsNames = ['fio', 'email', 'phone'];
  const form = document.getElementById('myForm');
  const submit = form.querySelector('input[type="submit"]');
  const resultContainer = document.getElementById('resultContainer');

  const fioRegexp = /^([A-Za-zА-Яа-яёЁ]+\s+){2}[A-Za-zА-Яа-яёЁ]+\s*$/;
  const phoneRegexp = /^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/;
  const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))\@{1}(ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com){1}$/i;

  const checkSum = phone => {
    const sum = phone
      .match(/\d+/g)
      .join('')
      .split('')
      .reduce((sum, current) => sum + parseInt(current), 0);

    return sum <= 30;
  };

  MyForm = {
    validate: function() {
      let isValid;
      let ErrorFields = [];

      inputsNames.forEach(inputName => {
        const input = form.querySelector(`input[name="${inputName}"]`);
        const value = input.value.trim();

        const setValid = (input, inputName) => {
          input.classList.remove('error');
          ErrorFields = ErrorFields.filter(item => item !== inputName);
        };

        const setInvalid = (input, inputName) => {
          input.classList.add('error');
          ErrorFields.push(inputName);
        };

        if (value.length === 0) {
          setInvalid(input, inputName);
          return;
        }

        if (inputName === 'fio') {
          if (fioRegexp.test(value)) {
            setValid(input, inputName);
          } else {
            setInvalid(input, inputName);
          }
        } else if (inputName === 'email') {
          if (emailRegexp.test(value)) {
            setValid(input, inputName);
          } else {
            setInvalid(input, inputName);
          }
        } else if (inputName === 'phone') {
          if (phoneRegexp.test(value) && checkSum(value)) {
            setValid(input, inputName);
          } else {
            setInvalid(input, inputName);
          }
        }
      });

      if (ErrorFields.length === 0) {
        isValid = true;
      } else {
        isValid = false;
      }

      return { isValid, ErrorFields };
    },

    getData: function() {
      const data = {};

      inputsNames.forEach(inputName => {
        const input = form.querySelector(`input[name="${inputName}"]`);
        data[inputName] = input.value;
      });

      return data;
    },

    setData: function(data) {
      inputsNames.forEach(inputName => {
        const input = form.querySelector(`input[name="${inputName}"]`);
        input.value = data[inputName];
      });
    },

    submit: function() {
      if (this.validate().isValid) {
        const url = encodeURI(form.getAttribute('action'));

        submit.setAttribute('disabled', 'disabled');

        fetch(url).then(response => {
          response.json().then(json => {
            let resp;

            try {
              resp = JSON.parse(atob(json.content));
            } catch (error) {
              return;
            }

            if (resp.status === 'success') {
              resultContainer.classList.add('success');
              resultContainer.innerHTML = 'Success';
              submit.removeAttribute('disabled');
            } else if (resp.status === 'error') {
              resultContainer.classList.add('error');
              resultContainer.innerHTML = resp.reason;
              submit.removeAttribute('disabled');
            } else if (resp.status === 'progress') {
              resultContainer.classList.add('progress');

              setInterval(() => {
                this.submit();
              }, resp.timeout);
            }
          });
        });
      }
    }
  };

  form.onsubmit = e => {
    e.preventDefault();
    MyForm.submit();
  };
};
