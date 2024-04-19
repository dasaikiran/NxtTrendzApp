import React, {Component} from 'react'
import CartContext from '../../context/CartContext'
import Popup from 'reactjs-popup'
import './index.css'

class CartSummary extends Component {
  state = {
    selectedPaymentMethod: '',
    confirmOrderEnabled: false,
    showMessage: false,
  }

  handleSelectPaymentMethod = event => {
    this.setState({
      selectedPaymentMethod: event.target.value,
      confirmOrderEnabled: event.target.value === 'Cash on Delivery',
    })
  }

  handleConfirmOrder = () => {
    this.setState({showMessage: true})
  }

  onCheckout = () => {
    this.setState({showMessage: false, confirmOrderEnabled: false})
  }

  render() {
    const {showMessage, confirmOrderEnabled} = this.state
    return (
      <CartContext.Consumer>
        {value => {
          const {cartList} = value
          const totalSum = cartList.reduce((acc, curObj) => {
            return acc + curObj.price * curObj.quantity
          }, 0)

          return (
            <div className="cart-summary-container">
              <h1 className="cart-summary-total">
                Order Total: <span>{totalSum}</span>
              </h1>
              <p>{`${cartList.length} items in cart`}</p>
              <Popup
                trigger={<button className="checkout-button">Checkout</button>}
                modal
                closeOnDocumentClick
                contentStyle={{width: '400px', maxWidth: '500px'}}
                onOpen={this.onCheckout}
              >
                {close => (
                  <div className="popup-content-1">
                    <div className="payment-methods">
                      <h2>Select Payment Method</h2>
                      <label>
                        <input
                          type="radio"
                          value="Net Banking"
                          disabled
                          name="payment"
                        />
                        Net Banking
                      </label>
                      <br />
                      <label>
                        <input
                          type="radio"
                          value="Cash on Delivery"
                          onChange={this.handleSelectPaymentMethod}
                          name="payment"
                        />
                        Cash on Delivery
                      </label>
                    </div>
                    <div className="summary">
                      <h2>Summary</h2>
                      <p>Number of items: {cartList.length}</p>
                      <p>Total Price: {totalSum}</p>
                    </div>
                    <button
                      className="confirm-order-button"
                      type="button"
                      onClick={this.handleConfirmOrder}
                      disabled={!confirmOrderEnabled}
                    >
                      Confirm Order
                    </button>
                    {showMessage && (
                      <p className="success-para">
                        Your order has been placed successfully
                      </p>
                    )}
                  </div>
                )}
              </Popup>
            </div>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default CartSummary
