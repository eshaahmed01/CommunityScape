import React, { useState } from 'react';
import { View, Image, Dimensions, StyleSheet, Animated } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface Props {
    images: string[];
}

const HorizontalImageCarousel: React.FC<Props> = ({ images }) => {
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
        <View style={styles.container} onLayout={onLayout}>
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        
        height: 360,
        resizeMode: 'cover',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
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

export default HorizontalImageCarousel;
