import { ScrollView, View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { getFirestore, doc, collection, getDocs } from 'firebase/firestore';
import { app, db } from '../firebaseconfig';
import FText from "../components/Ftext";
import { colours } from "../constants/colours";
import BackButton from "../components/BackButtons";

const CostEstimates = ({ route }) => {
  const { modelId } = route.params;
  const [costData, setCostData] = useState([]);
  const [totalCost, setTotalCost] = useState({ totalMin: 0, totalMax: 0 });

  useEffect(() => {
    const fetchCostData = async () => {
      try {
        const docRef = doc(db, 'Models', modelId);
        const costEstimatesRef = collection(docRef, 'CostEstimates');
        const costSnapshot = await getDocs(costEstimatesRef);
  
        if (!costSnapshot.empty) {
          const costList = costSnapshot.docs.map(doc => {
            console.log("Fetched document data:", doc.data());
            const data = doc.data();
            return Object.keys(data).map(key => {
              const range = data[key].split('-').map(value => parseInt(value.replace(/\D/g, '')));
              return {
                name: key,
                min: range[0],
                max: range[1]
              };
            });
          }).flat();
  
          console.log("Cost List: ", costList);
  
          const totalMin = costList.reduce((acc, item) => acc + item.min, 0);
          const totalMax = costList.reduce((acc, item) => acc + item.max, 0);
          setCostData(costList);
          setTotalCost({ totalMin, totalMax });
        } else {
          console.warn("No documents found in the 'CostEstimate' collection.");
        }
      } catch (error) {
        console.error("Error fetching cost estimate: ", error);
      }
    };
  
    fetchCostData();
  }, [modelId]);
  return (
    <ScrollView style={styles.mainContainer}>
      <BackButton />
      <View>
        <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{ marginTop: 120, marginLeft: 30 }}>
          Cost Estimates
        </FText>
        <FText fontSize="normal" fontWeight={400} color={colours.typography_80} style={{ marginTop: 2, marginLeft: 30 }}>
          Breakdown of the complete cost of the house
        </FText>
      </View>
      <View style={styles.totalCost}>
        <FText fontSize="large" fontWeight="700" color={colours.primary} style={{ marginTop: 20, marginLeft: 5, marginBottom: 15 }}>
          Total Estimated Cost:
        </FText>
        <FText fontSize="large" fontWeight="700" color='#8BC83F' style={{ marginTop: 20, marginLeft: 5, marginBottom: 15 }}>
          ${totalCost.totalMin} - ${totalCost.totalMax}
        </FText>
      </View>
      <View>
        <FText fontSize="large" fontWeight="700" color={colours.primary} style={{ marginTop: 30, marginLeft: 35, marginBottom: 15 }}>
          Cost Breakdown
        </FText>
      </View>
      {costData.map((item, index) => (
        <View key={index} style={styles.Cost}>
          <FText fontSize="large" fontWeight="700" color={colours.waterloo} style={{ marginTop: 20, marginLeft: 35, marginBottom: 15 }}>
            {item.name}
          </FText>
          <FText fontSize="large" fontWeight="700" color={colours.waterloo} style={{ marginTop: 20, marginLeft: 35, marginBottom: 15 }}>
            ${item.min} - ${item.max}
          </FText>
        </View>
      ))}
    </ScrollView>
  );
};

  
 export default CostEstimates;

 const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary,
        marginBottom: 30
    },
    totalCost: {
        flexDirection : 'row',
        alignSelf: 'center',
        borderBottomWidth: 0.7,
        borderBottomColor: 'grey',
        width: '90%',
        marginTop: 20
    },

    Cost: {
        alignSelf: 'center',
        borderBottomWidth: 0.7,
        borderBottomColor: 'grey',
        width: '90%',
        backgroundColor: '#F0FFFF',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    end:{
        marginBottom: 30
    }




})