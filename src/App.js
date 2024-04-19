import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const newCartLIst = cartList.filter(item => item.id !== id)
    this.setState({cartList: newCartLIst})
  }

  addCartItem = product => {
    const {cartList} = this.state
    const oldProduct = cartList.some(item => item.id === product.id)
    if (oldProduct) {
      this.setState(prev => {
        return {
          cartList: prev.cartList.map(item => {
            if (item.id === product.id) {
              const quantity = item.quantity + product.quantity
              const obj = {
                ...item,
                quantity,
              }
              return obj
            }
            return item
          }),
        }
      })
    } else {
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    }
  }

  onIncrement = id => {
    this.setState(prev => {
      return {
        cartList: prev.cartList.map(item => {
          if (item.id === id) {
            const quantity = item.quantity + 1
            return {
              ...item,
              quantity,
            }
          }
          return item
        }),
      }
    })
  }

  onDecrement = id => {
    const {cartList} = this.state
    const isquantity = cartList.find(item => item.id === id)
    if (isquantity.quantity > 1) {
      this.setState(prev => {
        return {
          cartList: prev.cartList.map(item => {
            if (item.id === id) {
              const quantity = item.quantity - 1
              return {
                ...item,
                quantity,
              }
            }
            return item
          }),
        }
      })
    } else {
      this.removeCartItem(id)
    }
  }

  removeAll = () => {
    this.setState({cartList: []})
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.onIncrement,
          decrementCartItemQuantity: this.onDecrement,
          removeAllCartItems: this.removeAll,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
