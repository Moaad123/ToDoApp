import React from 'react';
import {View, StyleSheet,Text, TouchableOpacity} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


function Tasks(props){
    return(
        <View style={styles.item}>
            <View style={styles.Leftitems}>
                <View style={{marginRight : 15}}><FontAwesome5 name="dungeon" size={26} color="#FF8C00"/></View>
                <Text style={styles.textItem}>{props.text}</Text>
            </View>
            <View><TouchableOpacity onPress={()=>{props.delete(props.indx,props.text)}}><Icons name="delete" size={24} color="black"/></TouchableOpacity></View>
        </View>
    )
}
const styles = StyleSheet.create(
    {
        Leftitems:{
            flexDirection : 'row',
            alignItems : 'center',
            flexWrap : 'wrap'
        },
        textItem:{
            maxWidth: '80%',
            color: '#000',
            fontSize: 15
        },
        item:{
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent : 'space-between',
            marginBottom: 20
        }
    }
);

export default Tasks;