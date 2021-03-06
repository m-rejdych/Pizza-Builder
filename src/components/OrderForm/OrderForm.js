import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styles from './OrderForm.module.css';
import Button from '../../Layout/UI/Buttons/Buttons';
import Spinner from '../../Layout/UI/Spinner/Spinner';
import Input from '../Input/Input';
import * as actions from '../../store/actions/index';

class OrderForm extends Component {
  state = {
    formValid: false,
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name',
        },
        validation: {
          required: true,
          minLength: 2,
        },
        valid: false,
        touched: false,
        value: '',
      },

      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Street',
        },
        validation: {
          required: true,
          minLength: 4,
        },
        valid: false,
        touched: false,
        value: '',
      },

      zipcode: {
        elementType: 'input',
        elementConfig: {
          type: 'number',
          placeholder: 'Your Zipcode',
        },
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
        },
        valid: false,
        touched: false,
        value: '',
      },

      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email',
        },
        validation: {
          required: true,
          minLength: 5,
          pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        },
        valid: false,
        touched: false,
        value: '',
      },

      phoneNumber: {
        elementType: 'input',
        elementConfig: {
          type: 'tel',
          placeholder: 'Your Phone Number',
        },
        validation: {
          required: true,
          minLength: 7,
        },
        valid: false,
        touched: false,
        value: '',
      },

      delivery: {
        elementType: 'select',
        elementConfig: {
          options: [
            { type: 'fast', displayType: 'Fast' },
            { type: 'cheap', displayType: 'Cheap' },
          ],
        },
        validation: {},
        valid: true,
        value: 'fast',
      },
    },
  };

  postDataHandler = async (event) => {
    event.preventDefault();
    await this.props.onPostData(
      this.state.orderForm,
      this.props.ingredients,
      this.props.price
    );
    this.props.history.push('/');
  };

  changedInputHandler = (event, id) => {
    const { orderForm } = this.state;
    const newElement = { ...orderForm[id] };
    newElement.value = event.target.value;
    newElement.valid = this.checkValidityHandler(event, id);
    newElement.touched = true;
    orderForm[id] = newElement;

    let formValid = true;
    for (let input in orderForm) {
      orderForm[input].valid && formValid
        ? (formValid = true)
        : (formValid = false);
    }
    this.setState({ orderForm, formValid });
  };

  checkValidityHandler = (event, id) => {
    let isValid = true;
    const target = event.target;
    const rules = this.state.orderForm[id].validation;

    if (rules.required && isValid) {
      isValid = target.value.trim() !== '';
    }

    if (rules.minLength && isValid) {
      isValid = target.value.length >= rules.minLength;
    }

    if (rules.maxLength && isValid) {
      isValid = target.value.length <= rules.maxLength;
    }

    if (rules.pattern && isValid) {
      isValid = rules.pattern.test(target.value);
    }

    return isValid;
  };

  render() {
    let inputs = [];
    for (let orderInput in this.state.orderForm) {
      inputs.push(
        <Input
          key={orderInput}
          id={orderInput}
          value={this.state.orderForm[orderInput].value}
          config={this.state.orderForm[orderInput].elementConfig}
          elementType={this.state.orderForm[orderInput].elementType}
          changed={(event) => this.changedInputHandler(event, orderInput)}
          invalid={!this.state.orderForm[orderInput].valid}
          touched={this.state.orderForm[orderInput].touched}
        />
      );
    }

    let content = null;
    this.props.loading
      ? (content = <Spinner />)
      : (content = (
          <form className={styles.OrderForm} onSubmit={this.postDataHandler}>
            {inputs}
            <Button disabled={!this.state.formValid} color="green">
              ORDER
            </Button>
          </form>
        ));
    return content;
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.pizzaBuilder.ingredients,
    price: state.pizzaBuilder.totalPrice,
    loading: state.orders.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onPostData: (orderForm, ingredients, price) =>
      dispatch(actions.postData(orderForm, ingredients, price)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OrderForm));
