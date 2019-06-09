import React from 'react';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

class RecipeCard extends React.Component {

  static propTypes = {
    name: PropTypes.string,
    url: PropTypes.string,
    imageUrl: PropTypes.string,
    onSecondaryCTAClick: PropTypes.func,
    secondaryCTAText: PropTypes.string
  }

  goToRecipe = () => {
    // open recipe in a new tab
    window.open(this.props.url, "_blank");
  }

  render() {
    const secondaryCTAVariant = this.props.secondaryCTAText === "Save Recipe" ? "success" : "danger";

    return (
      <div>
        <Card className="RecipeCard">
          <Card.Header>{this.props.name}</Card.Header>
          <img className="recipeImage" src={this.props.imageUrl} alt={this.props.name}></img>
          <Button className="Button"
            variant="primary"
            onClick={this.goToRecipe}>
            View Recipe
          </Button>
          <Button className="Button"
            variant={secondaryCTAVariant}
            onClick={() => this.props.onSecondaryCTAClick(this.props.idx)}>
            {this.props.secondaryCTAText}
          </Button>
        </Card>
      </div>
    );
  }
}

export default RecipeCard;