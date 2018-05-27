const e = window.React.createElement
const Component = window.React.Component
const axios = window.axios


class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      query: '', 
    }
    
    this.addImage = this.addImages.bind(this)
    this.addRandomImages = () => this.addImages('/random')
    this.addTrendingImage = () => this.addImages('/trending')
    this.clearImages = this.clearImages.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }
  
  async addImages(url, params) {
    let result = await axios.get(url, params)       
    this.setState({
      images: [...result.data, ...this.state.images]
    })
  }
  
  clearImages() {
    this.setState({images: []})
  }
  
  handleChange(evt) {
    this.setState({query: evt.target.value})
  }
  
  handleKeyPress(evt) {
    let q = this.state.query.trim()
    if (evt.which === 13 && q.length) {
      this.addImages('/search', {params: {q}})
    }
  }
  
  render() {
    let images = this.state.images.map(x => 
      e('iframe', {src: x.embed_url, 
                   width: 320, 
                   height: 320, 
                   frameBorder: '0', 
                   className: 'giphy-embed'}))
    
    return e('div', null, 
      e('span', null, `Showing ${this.state.images.length} images`),
      e('button', {onClick: this.addRandomImages}, 'Add random images'),
      e('button', {onClick: this.addTrendingImage}, 'Add trending images'),
      e('input', {placeholder: 'Query',
                  value: this.state.query,
                  onChange: this.handleChange,
                  onKeyPress:  this.handleKeyPress}, null),
      e('button', {onClick: this.clearImages}, 'Clear images'),
      e('div', null, ...images),
    )
  }
}

window.ReactDOM.render(
  e(Main),
  document.getElementById('app')
)