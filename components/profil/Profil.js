import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Caption, View, Title, Text, Divider, Tile } from '@shoutem/ui';
import CompletedSurveys from './components/CompletedSurveys';
import { PieChart, StackedBarChart } from 'react-native-svg-charts'
import { Circle, G, Line } from 'react-native-svg'
import {updateCompletedSurveys} from '../../actions';

class Profil extends Component {
 
  constructor(props){
    super(props);
    this.getAllThemes=this.getAllThemes.bind(this);
    this.changeSizeText=this.changeSizeText.bind(this);

  }

  getAllThemes(data, themes, colors){
    let array_render=[];
    var maMap=data;
    var theme=themes;
    var color=colors;
    Object.keys(data).forEach(function(k, v){
        array_render.push(
            <Text style={{color: color[k]}} key={theme[k]}>{theme[k]} : {maMap[k]}</Text>
        );
    });
    return array_render;
  }

  changeSizeText(data,themes,colors){
    let array_render=[];
    var maMap=data;
    var theme=themes;
    var color=colors;
    Object.keys(data).forEach(function(k, v){
        // console.log(maMap[k]);
        array_render.push(
            <Text key={theme[k]}>{theme[k]} : {maMap[k]} sondages complétés</Text>
        );
    });
    return array_render;
 }

componentDidMount() {
    return fetch('http://cyti.club/profil/surveys/page?id_user='+this.props.userData[0]._id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(updateCompletedSurveys({
            completedSurveys: responseJson.surveys,
            totalCompletedSurveys: responseJson.total,
            modeCompletedSurveys: responseJson.fashion,
            shoppingCompletedSurveys: responseJson.shopping,
            sportCompletedSurveys: responseJson.sport,
            beautyCompletedSurveys: responseJson.beauty,

        }));

      })
      .catch((error) => {
        console.error(error);
      });
}

  render() {
    const data = [ 
        Number(this.props.completedSurveysReducer.beautyCompletedSurveys),
        Number(this.props.completedSurveysReducer.sportCompletedSurveys),
        Number(this.props.completedSurveysReducer.shoppingCompletedSurveys),
        Number(this.props.completedSurveysReducer.modeCompletedSurveys)
    ];

    const index = ["beauty", "sport" , "shopping" , "fashion"];
    const colors = ["#262e45", "#ff9800" , "#7db9b3" , "#f2bcfb"];
    const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7);
    const pieData = data
        .map((value, index) => ({
            value,
            color: colors[index],
            key: `pie-${index}`,
            onPress: () => {},
        }));

    const display_caption= this.getAllThemes(data,index,colors);

    return (

	   	<View style={{ flex: 1 , flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
   			{/* <Title style={{alignItems: 'center'}}>Mes Stats</Title>
	    	<View style={{ flex: 1 , flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
	      		<View style={{ flex: 1}}>
            <PieChart
                style={ { height: 200 } }
                data={ pieData }
                colors={ colors }
            />
	      		</View>
	      		<View style={{ flex: 1 }}>
            {display_caption}
	   			  </View>
        </View> */}
        <Tile styleName="text-centric">
          <Title styleName="md-gutter-vertical">SONDAGES COMPLETES</Title>
          <View styleName="horizontal space-between h-center v-center">
            <PieChart
              style={ { height: 200, flex : 1} }
              data={ pieData }
              colors={ colors }
            />
            <View styleName="space-between stretch xl-gutter-vertical" style={{flex:1, paddingLeft:20}}>
              {display_caption}
            </View>  
          </View>  
        </Tile>  

        <Divider styleName="line small center" />
	    	
        <View style={{ flex: 1 , flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <CompletedSurveys/>
      		</View>
	    </View>  
    );
  }
}

  const mapStateToProps = (state, ownProps) => {
    return{
      userData : state.profilReducer.connected,
      completedSurveysReducer : state.profilReducer.completedSurveys,
    }
  }

  export default connect(mapStateToProps)(Profil);