window.onload = () => {
  const inputsNames = ['fio', 'email', 'phone'];
  const form = document.getElementById('myForm');
  const resultContainer = document.getElementById('resultContainer');

  const MyForm = {
    validate: function() {
      const validEmails = [
        'ya.ru',
        'yandex.ru',
        'yandex.ua',
        'yandex.by',
        'yandex.kz',
        'yandex.com'
      ];
      let isValid;
      let ErrorFields = [];

      const setValid = (input, inputName) => {
        input.classList.remove('error');
        ErrorFields = ErrorFields.filter(item => item !== inputName);
      };

      const setInvalid = (input, inputName) => {
        input.classList.add('error');
        ErrorFields.push(inputName);
      };

      const phoneRegexp = /^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/;
      const checkSum = phone => {
        const sum = phone
          .split('')
          .filter(item => Number.isInteger(parseInt(item)))
          .reduce((sum, current) => sum + parseInt(current), 0);

        return sum <= 30;
      };

      inputsNames.forEach(inputName => {
        const input = document.querySelector(`input[name="${inputName}"]`);
        const value = input.value.trim();

        if (value.length === 0) {
          setInvalid(input, inputName);
          return;
        }

        if (inputName === 'fio') {
          if (value.split(' ').length === 3) {
            setValid(input, inputName);
          } else {
            setInvalid(input, inputName);
          }
        } else if (inputName === 'email') {
          const emailDomain = value.match(/@(.*)$/)[0];

          if (
            validEmails.filter(item => `@${item}` === emailDomain).length === 1
          ) {
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
        const input = document.querySelector(`input[name="${inputName}"]`);
        data[inputName] = input.value;
      });

      return data;
    },

    setData: function(data) {
      inputsNames.forEach(inputName => {
        const input = document.querySelector(`input[name="${inputName}"]`);
        input.value = data[inputName];
      });
    },

    submit: function() {
      if (this.validate().isValid) {
          const url = encodeURI(form.getAttribute('action'));

          fetch(url, { method: 'post', body: new FormData(form), mode: 'no-cors' })
            .then((resp) => {
                if (resp.status === 'success') {
                    resultContainer.classList.add('success');
                    resultContainer.innerHTML = 'Success';
                } else if (resp.status === 'error') {
                    resultContainer.classList.add('error');
                    resultContainer.innerHTML = resp.reason;
                } else if (resp.status === 'progress') {
                    resultContainer.classList.add('progress');

                    setInterval(() => {
                        this.submit();
                    }, resp.timeout);
                }
            });
      }
    }
  };

  form.onsubmit = e => {
    e.preventDefault();
    MyForm.submit();
  };
};
