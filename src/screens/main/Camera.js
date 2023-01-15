import React, {useState} from 'react';
import {
  SafeAreaView,
  Dimensions,
  Pressable,
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import FFmpegWrapper from '../../constants/FFmpegWrapper';

const SCREEN_WIDTH = Dimensions.get('screen').width; // 화면 width 사이즈
const SCREEN_HEIGHT = Dimensions.get('screen').height; // 화면 height 사이즈
export const FRAME_PER_SEC = 1; // 몇초마다 끊을것인지
export const FRAME_WIDTH = 160; // 하나의 프레임당 width 길이 [노란색 border 의 프레임을 뜻함]
const TILE_HEIGHT = 80; // 4 sec. 의 높이 길이
const TILE_WIDTH = FRAME_WIDTH / 2; // 현재 노란색 프레임의 반크기

const DURATION_WINDOW_DURATION = 2; // 프레임 몇개를 사용할것인지 
const DURATION_WINDOW_BORDER_WIDTH = 4; // 테두리 굵기
const DURATION_WINDOW_WIDTH =
  DURATION_WINDOW_DURATION * FRAME_PER_SEC * TILE_WIDTH; // 총 노란색 프레임의 width 길이
const POPLINE_POSITION = '50%'; // 노란색 프레임 중간 노란색 divder 의 위치 선정 50% === center 

const getFileNameFromPath = path => { // 파일 이름 가져오는 함수
  const fragments = path.split('/');
  let fileName = fragments[fragments.length - 1];
  fileName = fileName.split('.')[0];
  return fileName;
};

const FRAME_STATUS = Object.freeze({
  LOADING: {name: Symbol('LOADING')},
  READY: {name: Symbol('READY')},
});

const Camera = () => {
  const [selectedVideo, setSelectedVideo] = useState(); // {uri: <string>, localFileName: <string>, creationDate: <Date>}
  const [frames, setFrames] = useState(); // <[{status: <FRAME_STATUS>, uri: <string>}]>
  const [audio, setAudio] = useState(); // <[{status: <FRAME_STATUS>, uri: <string>}]>

  const handlePressSelectVideoButton = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then(videoAsset => {
      console.log(`Selected video ${JSON.stringify(videoAsset, null, 2)}`);
      setSelectedVideo({
        uri: videoAsset.sourceURL || videoAsset.path,
        localFileName: getFileNameFromPath(videoAsset.path),
        creationDate: videoAsset.creationDate,
      });
    });
  };

  const handleVideoLoad = async videoAssetLoaded => { // 영상이 업로드 된후 동작 videoAssetLoaded 안에는 들어온 영상의 정보가 담겨져있다.
    const numberOfFrames = Math.ceil(videoAssetLoaded.duration); // 영상의 초를 반올림함  5.758999824523926 -> 6
    setFrames( // 영상이 로드가된후 초마다 만들어진 프레임의 상태를 전부 loading 으로 채워준다.
      Array(numberOfFrames).fill({
        status: FRAME_STATUS.LOADING.name.description,
      }),
    );

    await FFmpegWrapper.getFrames( // 업로드된 영사을 FFmpeg Command 를 통하여 원하는 초마다 프레임을자르고 반환
      selectedVideo.localFileName, // 업로드된 영상의 이름
      selectedVideo.uri, // 업로드된 영상의 uri
      numberOfFrames, // 프레임의 갯수
      filePath => { // successCallback
        const _framesURI = []; // 각 프레임을 담을 배열
        for (let i = 0; i < numberOfFrames; i++) {
          _framesURI.push( // 각프레임을 하나하나 담는다. 
            `${filePath.replace('%4d', String(i + 1).padStart(4, 0))}`, // FFmpegWrapper 에서 지정한 outputImagePath 의 이름중 %4d' -> padStart 를 통해 받은 인덱스 예) 0,1,2,3 -> 0001 ,0002,0003,0004 로 변경후 교체
          );
        }
        const _frames = _framesURI.map(_frameURI => ({ // 받은 배열들을 다시 map으로 반복문을 돌려 프레임마다 uri 를 저장해주고 상태를 LOADING -> READY 으로 변경해준다.
          uri: _frameURI,
          status: FRAME_STATUS.READY.name.description,
        }));
        setFrames(_frames); // 변경된 값들을 useState 를통해 다시 저장
      },
    );
    await FFmpegWrapper.getAudio( // 업로드된 영사을 FFmpeg Command 를 통하여 원하는 초마다 프레임을자르고 반환
      selectedVideo.localFileName, // 업로드된 영상의 이름
      selectedVideo.uri, // 업로드된 영상의 uri
      filePath => { // successCallback
        console.log(filePath)
        setAudio(filePath); // 변경된 값들을 useState 를통해 다시 저장
      },
    );
  };

  const renderFrame = (frame, index) => {
    if (frame.status === FRAME_STATUS.LOADING.name.description) { // 받은 프레임의 상태가 LOADING 이라면
      return <View style={styles.loadingFrame} key={index} />; // 로딩중인 프레임 반환
    } else { // 받은 프레임의 상태가 READY 이라면
      return ( // 정상적인 프레임 반환
        <Image
          key={index}
          source={{uri: 'file://' + frame.uri}} // 파일은 저장했지만 아이폰 기준으로 file://을 붙여줘야하므로 file 포함애서 반환
          style={{
            width: TILE_WIDTH,
            height: TILE_HEIGHT,
          }}
          onLoad={() => { // 다되면 이미지가 반환됬다고 알림
            console.log('Image loaded');
          }}
        />
      );
    }
  };
  const [currentTime, setCurrentTime] = useState(0);
  handleProgress = (progress) => {
    // console.log(progress.currentTime)
  }
const onSeeking = (data) => {
  
};
const handleScroll = (data) => {
  // setCurrentTime(Math.ceil(data.nativeEvent.contentOffset.x/(FRAME_WIDTH/2)))
  setCurrentTime(data.nativeEvent.contentOffset.x/(FRAME_WIDTH/2))
}
  return (
    <SafeAreaView style={styles.mainContainer}>
      {selectedVideo ? ( // 선택된 비디오가 있다면
        <>
          <View style={styles.videoContainer}>
            <Video
              style={styles.video}
              resizeMode={'cover'}
              source={{uri: selectedVideo.uri}}
              repeat={true}
              onLoad={handleVideoLoad}
              onProgress = {handleProgress}
              paused={true}
              currentTime={currentTime}
              onSeek={onSeeking}
            />
          </View>
          {frames && (
            <View style={styles.durationWindowAndFramesLineContainer}>
              <View style={styles.durationWindow}>
                <View style={styles.durationLabelContainer}>
                  <Text style={styles.durationLabel}>
                    {DURATION_WINDOW_DURATION} sec.
                  </Text>
                </View>
              </View>
              <View style={styles.popLineContainer}>
                <View style={styles.popLine} />
              </View>
              <View style={styles.durationWindowLeftBorder} />
              <View style={styles.durationWindowRightBorder} />
              <ScrollView
                onScroll={handleScroll}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={styles.framesLine}
                alwaysBounceHorizontal={true}
                scrollEventThrottle={1}>
                <View style={styles.prependFrame} />
                {frames.map((frame, index) => renderFrame(frame, index))}
                <View style={styles.appendFrame} />
              </ScrollView>
            </View>
          )}
        </>
      ) : ( // 선택된 비디오가 없다면
        <Pressable
          style={styles.buttonContainer}
          onPress={handlePressSelectVideoButton}>
          <Text style={styles.buttonText}>Select a video</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: 0.6 * SCREEN_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 0,
  },
  video: {
    height: '100%',
    width: '100%',
  },
  durationWindowAndFramesLineContainer: {
    top: -DURATION_WINDOW_BORDER_WIDTH,
    width: SCREEN_WIDTH,
    height: TILE_HEIGHT + DURATION_WINDOW_BORDER_WIDTH * 2,
    justifyContent: 'center',
    zIndex: 10,
  },
  durationWindow: {
    width: DURATION_WINDOW_WIDTH,
    borderColor: 'yellow',
    borderWidth: DURATION_WINDOW_BORDER_WIDTH,
    borderRadius: 4,
    height: TILE_HEIGHT + DURATION_WINDOW_BORDER_WIDTH * 2,
    alignSelf: 'center',
  },
  durationLabelContainer: {
    backgroundColor: 'yellow',
    alignSelf: 'center',
    top: -26,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  durationLabel: {
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '700',
  },
  popLineContainer: {
    position: 'absolute',
    alignSelf: POPLINE_POSITION === '50%' && 'center',
    zIndex: 25,
  },
  popLine: {
    width: 3,
    height: TILE_HEIGHT,
    backgroundColor: 'yellow',
  },
  durationWindowLeftBorder: {
    position: 'absolute',
    width: DURATION_WINDOW_BORDER_WIDTH,
    alignSelf: 'center',
    height: TILE_HEIGHT + DURATION_WINDOW_BORDER_WIDTH * 2,
    left: SCREEN_WIDTH / 2 - DURATION_WINDOW_WIDTH / 2,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: 'yellow',
    zIndex: 25,
  },
  durationWindowRightBorder: {
    position: 'absolute',
    width: DURATION_WINDOW_BORDER_WIDTH,
    right: SCREEN_WIDTH - SCREEN_WIDTH / 2 - DURATION_WINDOW_WIDTH / 2,
    height: TILE_HEIGHT + DURATION_WINDOW_BORDER_WIDTH * 2,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: 'yellow',
    zIndex: 25,
  },
  framesLine: {
    width: SCREEN_WIDTH,
    position: 'absolute',
  },
  loadingFrame: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
  },
  prependFrame: {
    width: SCREEN_WIDTH / 2 - DURATION_WINDOW_WIDTH / 2,
  },
  appendFrame: {
    width: SCREEN_WIDTH / 2 - DURATION_WINDOW_WIDTH / 2,
  },
});

export default Camera;
