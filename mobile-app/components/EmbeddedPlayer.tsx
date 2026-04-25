import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Platform,
    Text,
    TouchableOpacity,
} from 'react-native';
// FIXED: replaced expo-video with 
// expo-av
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import * as WebBrowser from 'expo-web-browser';
// FIXED: replaced react-native-webview with 
// expo-web-browser
import * as Linking from 'expo-linking';
import { COLORS, SIZES } from '@/constants/theme';
import { isYouTubeUrl, isTeraboxUrl, isVimeoUrl, isDailymotionUrl } from '@/utils/videoUtils';

interface EmbeddedPlayerProps {
    videoUri: string | null;
}

const isValidHttpUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
        const parsed = new URL(url.trim());
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (error) {
        return false;
    }
};

const EmbeddedPlayer: React.FC<EmbeddedPlayerProps> = ({ videoUri }) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // FIXED: implemented expo-av state pattern
    const videoRef = React.useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const togglePlay = async () => {
        if (isPlaying) {
            await videoRef.current?.pauseAsync();
        } else {
            await videoRef.current?.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        setHasError(false);
        setIsLoading(true);
    }, [videoUri]);

    if (!videoUri) {
        return (
            <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>Video will play here</Text>
            </View>
        );
    }

    if (hasError) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Unable to load video</Text>
                <Text style={styles.errorSubtext}>
                    The link may be invalid or require a web browser.
                </Text>
                <TouchableOpacity
                    style={styles.openBrowserButton}
                    onPress={() => Linking.openURL(videoUri)}
                >
                    <Text style={styles.openBrowserButtonText}>Open in Browser</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => setHasError(false)}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!isValidHttpUrl(videoUri)) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Invalid URL</Text>
                <Text style={styles.errorSubtext}>
                    Please enter a valid http or https video link.
                </Text>
            </View>
        );
    }

    const isYouTube = isYouTubeUrl(videoUri);
    const isTerabox = isTeraboxUrl(videoUri);
    const isVimeo = isVimeoUrl(videoUri);
    const isDailymotion = isDailymotionUrl(videoUri);

    // Web rendering
    if (Platform.OS === 'web') {
        if (isYouTube) {
            let videoId = '';
            const match = videoUri.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})/);
            if (match) {
                videoId = match[1];
            }
            const embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`;

            return (
                <View style={styles.container}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ border: 'none', borderRadius: SIZES.radius }}
                    />
                </View>
            );
        } else if (isVimeo) {
            let videoId = '';
            const match = videoUri.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
            if (match) {
                videoId = match[1];
            }
            const embedUrl = `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`;

            return (
                <View style={styles.container}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        style={{ border: 'none', borderRadius: SIZES.radius }}
                    />
                </View>
            );
        } else if (isDailymotion) {
            let videoId = '';
            const match = videoUri.match(/(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/);
            if (match) {
                videoId = match[1];
            }
            // ui-start-screen-info=false & ui-logo=false to hide details
            const embedUrl = `https://www.dailymotion.com/embed/video/${videoId}?ui-start-screen-info=false&ui-logo=false&autoplay=1`;

            return (
                <View style={styles.container}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        style={{ border: 'none', borderRadius: SIZES.radius }}
                    />
                </View>
            );
        } else if (isTerabox) {
            return (
                <View style={styles.container}>
                    <View style={styles.teraboxHint}>
                        <Text style={styles.teraboxHintText}>Click to interact</Text>
                    </View>
                    <iframe
                        width="100%"
                        height="100%"
                        src={videoUri}
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; fullscreen"
                        style={{ border: 'none', borderRadius: SIZES.radius }}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <video
                        src={videoUri}
                        controls
                        style={{ width: '100%', height: '100%', borderRadius: SIZES.radius, objectFit: 'contain' }}
                    />
                </View>
            );
        }
    }

    // Mobile rendering
    // FIXED: replaced react-native-webview with expo-web-browser for social links
    if (isYouTube || isVimeo || isDailymotion || isTerabox) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Open in Browser</Text>
                    <Text style={styles.errorSubtext}>
                        This video platform requires a web browser for playback.
                    </Text>
                    <TouchableOpacity
                        style={styles.openBrowserButton}
                        onPress={() => WebBrowser.openBrowserAsync(videoUri)}
                    >
                        <Text style={styles.openBrowserButtonText}>Open in Browser</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // FIXED: replaced expo-video with expo-av for direct video links
    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                source={{ uri: videoUri }}
                style={{ width: '100%', height: '100%' }}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
                isMuted={isMuted}
                isLooping={false}
                useNativeControls
                onPlaybackStatusUpdate={(status) => {
                    setStatus(status);
                    if (status.isLoaded) {
                        setIsPlaying(status.isPlaying);
                    }
                }}
            />
            {isLoading && !status.isLoaded && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 220,
        backgroundColor: COLORS.black,
        marginHorizontal: SIZES.padding,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        marginBottom: SIZES.padding,
        position: 'relative',
    },
    placeholderContainer: {
        height: 100,
        backgroundColor: COLORS.lightGray,
        marginHorizontal: SIZES.padding,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
    placeholderText: {
        color: COLORS.gray,
        fontSize: SIZES.body3,
    },
    errorContainer: {
        height: 220,
        backgroundColor: COLORS.lightGray,
        marginHorizontal: SIZES.padding,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SIZES.padding,
        padding: SIZES.padding,
    },
    errorText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    errorSubtext: {
        color: COLORS.gray,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    teraboxHint: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
        borderRadius: 4,
        zIndex: 10,
    },
    teraboxHintText: {
        color: COLORS.white,
        fontSize: 12,
        textAlign: 'center',
    },
    webView: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.black,
        zIndex: 5,
    },
    loadingText: {
        color: COLORS.white,
        marginTop: 10,
        fontSize: 14,
    },
    openBrowserButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 12,
    },
    openBrowserButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    retryButton: {
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    retryButtonText: {
        color: COLORS.text,
        fontSize: 14,
    },
});

export default EmbeddedPlayer;
