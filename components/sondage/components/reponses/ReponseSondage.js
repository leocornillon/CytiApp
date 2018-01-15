import React, { Component } from 'react';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import Animation from 'lottie-react-native'; 

import { Screen, NavigationBar, Title, Card, View, Divider, Button, Text, Icon, Heading } from '@shoutem/ui';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import ReponseOuiNon from './ReponseOuiNon';
import ReponseUnique from './ReponseUnique';
import ReponseMultiple from './ReponseMultiple';

import anim from '../../../../assets/animations/loader.json';

// Types de questions possibles:
// Yes-no
// Choix multiple parmis liste
// Choix unique parmis liste 

const { width, height } = Dimensions.get('window');
let _carousel;

class ReponseSondage extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading : true,
            activeSlide : 0,
            reponses : [],
            questions: [
                {
                  "_id" : "0",
                  "position" : 0,
                  "txt" : "Te maquilles tu régulièrement ?",
                  "question_type" : "YesNo",
                  "mandatory" : true,
                  "answers" : []
                },
                {
                  "_id" : "1",
                  "position": 1,
                  "txt" : "Comment réveiller des yeux fatigués ?",
                  "question_type" : "unique",
                  "mandatory" : true,
                  "answers" : [
                    {
                      "_id" : "0",
                      "id_answer" : "0",
                      "position": "0",
                      "txt" : "La solution make-up"
                    },
                    {
                      "_id" : "1",
                      "id_answer" : "1",
                      "position": "1",
                      "txt" : "La solution médicale"
                    }
                  ]
                },
                {
                  "_id" : "2",
                  "position": 2,
                  "txt" : "Qu'est ce qui est important pour toi ?",
                  "question_type" : "multiple",
                  "mandatory" : false,
                  "answers" : [
                    {
                      "_id" : "0",
                      "id_answer" : "0",
                      "position": "0",
                      "txt" : "Le nez"
                    },
                    {
                      "_id" : "1",
                      "id_answer" : "1",
                      "position": "1",
                      "txt" : "La bouche"
                    },
                    {
                      "_id" : "2",
                      "id_answer" : "2",
                      "position": "2",
                      "txt" : "Les yeux"
                    },
                    {
                      "_id" : "3",
                      "id_answer" : "3",
                      "position": "3",
                      "txt" : "Le teint"
                    },
                    {
                      "_id" : "4",
                      "id_answer" : "4",
                      "position": "4",
                      "txt" : "Les cheveux"
                    }
                  ]
                }
              ]
        };
        this._renderItem = this._renderItem.bind(this);
        this.addMultipleAnswer = this.addMultipleAnswer.bind(this);
        this.addUniqueAnswer = this.addUniqueAnswer.bind(this);
    }

    addUniqueAnswer(id, reponse){
      this.state.reponses[id] = reponse;
    }

    addMultipleAnswer(id, reponse){
      //Si le tableau n'existe pas on le créé
      if(this.state.reponses[id] === undefined){
        this.state.reponses[id] = [];
        this.state.reponses[id].push(reponse);
        return;
      }

      let index = this.state.reponses[id].indexOf(reponse);
      if(index !== -1){
        this.state.reponses[id].splice(index,1);
      } else {
        this.state.reponses[id].push(reponse);
      }

      console.log(this.state.reponses);

    }

    _renderItem ({item, index}) {
      
      let template;
      if(item.question_type === 'YesNo')
        template = (<ReponseOuiNon 
                      id = { item._id }
                      next = { () => _carousel.snapToNext()}
                      addAnswer = { this.addUniqueAnswer }
                    />);
      else if (item.question_type === 'unique')
        template = (<ReponseUnique 
                      id = { item._id }
                      next = { () => _carousel.snapToNext()} 
                      reponses = { item.answers }
                      addAnswer = { this.addUniqueAnswer }
                    />);
      else if (item.question_type === 'multiple')
        template = (<ReponseMultiple 
                      id = { item._id }
                      next={ () => _carousel.snapToNext()} 
                      reponses = { item.answers } 
                      addAnswer = { this.addMultipleAnswer }
                    />);

      return (
          <Card style={{width : width * 0.85, flex : 1, marginTop : 50, marginBottom : 50}}>
            <View styleName="content">
              <Title styleName="md-gutter-bottom h-center">{item.txt}</Title>
              <Divider styleName="line" />
              {template}
            </View> 
          </Card>
      );
    }

    componentDidMount() {
      
      //TODO: Replace adress with the serveur
      return fetch('https://facebook.github.io/react-native/movies.json')
      // return fetch('https://facebook.github.io/react-native/movies.json')
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            //TODO: Décommenter la ligne
            // reponses: responseJson,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }

    render() {
      
      if(this.state.isLoading){
        return(
          <Screen>
            <NavigationBar
                styleName="inline"
                hasHistory
                centerComponent={
                    <Title styleName="bold h-center" numberOfLines={1}>
                        {this.props.sondage.title}
                    </Title>
                }
                navigateBack={ () => {
                    const navigateBack = NavigationActions.back()
                    this.props.navigation.dispatch(navigateBack);
                }}
            />
            <View styleName="vertical h-center v-center" style={{flex:1}}>
              <Animation
                ref={animation => {
                  this.animation = animation;
                }}
                style={{
                  width: 200,
                  height: 200
                }}
                loop={true}
                source={anim}
              />
            </View> 
          </Screen> 
        );
      }

      return(
          <Screen>
              <NavigationBar
                  styleName="inline"
                  hasHistory
                  centerComponent={
                      <Title styleName="bold h-center" numberOfLines={1}>
                          {this.props.sondage.title}
                      </Title>
                  }
                  navigateBack={ () => {
                      const navigateBack = NavigationActions.back()
                      this.props.navigation.dispatch(navigateBack);
                  }}
              />

              <Carousel
                ref={(c) =>  _carousel = c }
                data = { this.state.questions }
                renderItem = { this._renderItem }
                sliderWidth = { width }
                itemWidth = { width * 0.85 }
                onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                enableSnap={true}
                enableMomentum={true}
              />

              <Pagination
                carouselRef = { _carousel }
                activeDotIndex = {this.state.activeSlide }
                dotsLength = { this.state.questions.length }
                tappableDots = { true }
              />
          </Screen>  
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return{
        navigation : state.navigationReducer.navigator,
        sondage: state.sondageReducer.sondage,
    }
}

export default connect(mapStateToProps)(ReponseSondage);