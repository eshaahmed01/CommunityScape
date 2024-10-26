import React, { useState } from 'react';
import { View, Image, Dimensions, StyleSheet, Animated, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Props {
    images: string[];
    visible: boolean;
    onClose: () => void;
}

const Carousel: React.FC<Props> = ({ images, visible, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const scrollX = new Animated.Value(0);

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const onMomentumScrollEnd = (event: any) => {
        setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / screenWidth));
    };

    const onLayout = (event: any) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
            <TouchableOpacity style={styles.closeIconContainer} onPress={onClose}>
                    <Icon name="close-circle" size={35} color="#fff" />
                </TouchableOpacity>
                <View style={styles.carouselContainer} onLayout={onLayout}>
                    <Animated.ScrollView
                        horizontal
                        pagingEnabled
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                    >
                        {images.map((image, index) => (
                            <Image key={index} source={{ uri: image }} style={[styles.image, { width: containerWidth }]} />
                        ))}
                    </Animated.ScrollView>
                    <View style={styles.dotsContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentIndex === index && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },
    loseIconContainer: {
        position: 'absolute',
        top: 40, // Adjust based on the design
        right: 20, // Adjust based on the design
        zIndex: 1, // Ensure it stays on top
    },
    carouselContainer: {
        width: screenWidth * 0.9, // Carousel takes 90% of screen width
        height: screenHeight * 0.6, // 50% of screen height for the carousel
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden', // For rounded corners
    },
    image: {
        height: '100%',
        resizeMode: 'cover',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 5,
        backgroundColor: '#888',
        marginHorizontal: 5,
    },
    activeDot: {
        width: 20,
        backgroundColor: '#234F68',
    },
});

export default Carousel;
