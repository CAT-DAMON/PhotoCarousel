
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import PhotoCarousel from './PhotoCarousel.jsx';
import PhotoModal from './PhotoModal.jsx';
import './dist/stylesheet.css';
import { HeartButton } from './styled-components.jsx'
import { ServiceContainer } from './styled-components.jsx'
import { CarouselContainer } from './styled-components.jsx'
import { ModalShow } from './styled-components.jsx'

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoaded: false,
      show: false,
      productData: []
    }
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    axios.get('/api/listing/1')
      .then((response) => {
        this.setState({
          isLoaded: true,
          productData: response.data
        })
      })
      .catch((error) => {
        console.error(error);
      })
  }

  handleShowModal() {
    this.setState({
      show: true
    });
    console.log('ModalShowing: ', this.state.show);
  }

  handleCloseModal() {
    this.setState({
      show: false
    })
  }


  render() {
    if (!this.state.isLoaded) {
      return <h3>Loading...</h3>
    } else {
      return (
        <div>
          <ServiceContainer className={this.state.show ? "modal-open" : ""}>
            <HeartButton>
              <img id="love-button" src="https://i.imgur.com/Q5diR0M.png"/>
            </HeartButton>
            <CarouselContainer>
              <PhotoCarousel products={this.state.productData} handleShowModal={this.handleShowModal}/>
            </CarouselContainer>
            {this.state.show ? <ModalShow> </ModalShow> : <div></div>}
          </ServiceContainer>
        </div>
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById('photoCarousel'));
