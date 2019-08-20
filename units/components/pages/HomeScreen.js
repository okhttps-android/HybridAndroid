import React from "react";
import {connect} from 'react-redux'
import {
    Platform,
    StatusBar,
    View,
    Text,
    Button,
    TouchableHighlight,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Image,
    ouchableOpacity
} from "react-native";
import {changeBtnText} from "../../actions/bi/index";
import YRHttpRequest from  "../../utils/network/fetch"
import {API} from "../../utils/network/axios/api.config";
import YRSearchBar from "../common/YRSearchBar";

import {NativeModules} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";
const YRRnBridge = NativeModules.YRRnBridge;

class HomeScreen extends React.Component {
    // static navigationOptions = {
    //     title: '主页面',
    //     headerStyle: Platform.OS === 'android' ? {
    //         paddingTop: StatusBar.currentHeight,
    //         height: StatusBar.currentHeight + 56,
    //     } : {}
    // }

    static navigationOptions = {
        title: 'DetailsScreen',
        headerBackTitle:'返回',//设置返回此页面的返回按钮文案，有长度限制
        headerLeft:(

            <TouchableOpacity  style={{marginLeft:0,width:50,height:30}}


                               onPress={() => {

                                   YRRnBridge.goBack();

                               }}

            >


                <Image  style={{marginLeft:20,marginTop:6,width:12,height:20,}}

                        source={{uri: 'uu_back-icon'}}

                ></Image>

            </TouchableOpacity>


        )
    }

    constructor(props) {
        super(props);
        this.state = {
            name: 'YRSearchBar',
            inputValue: "",
            isRefreshing: false
        };
    }



    loadData=()=>{
        //fetch请求
        console.log("loadData():", API.TEST_GET);
        YRHttpRequest.get(API.TEST_GET).then(res => {
            console.log("res.data=", res);
        }).catch(err => {
            console.log("res.data=", err);
        })
        //axios请求
        // console.log("loadData():",API.TEST_GET);
        // sendGet({url:API.TEST_GET,params:{
        //     name:'arison'
        // }}).then(res=>{
        //     console.log("res.data=",res);
        // }).catch(err=>{
        //     console.log("res.data=",err);
        // })
    }

    onSearchChangeText = (text) => {
        console.log("onSearchChangeText() text:", text);
        if (text) {
            this.setState({inputValue: text})
            clearTimeout(this.settimeId);
            this.settimeId = setTimeout(() => {

            }, 1000);
        } else {
            this.setState({inputValue: ''})
        }
    }

    onSearch = (inputValue) => {
        console.log("onSearch()", inputValue);
    }
    _onRefresh = () => {
        this.setState({
            isRefreshing: true
        });
        console.log("_onRefresh()");
        setTimeout(() => {
            this.setState({
                isRefreshing: false
            });
        }, 6000);
    }

    componentDidMount() {

        //适配iOS侧滑返回
        this.viewDidAppear = this.props.navigation.addListener( //类似OC里的 viewDidAppear方法
            'didFocus',// 有4个取值 willFocus即将显示、didFocus完成显示、willBlur即将消失、didBlur消失
            (obj)=>{

                YRRnBridge.gestureEnabled(true);

            }
        )

        this.viewWillDisappear = this.props.navigation.addListener(//类似OC里的 viewWillDisappear方法
            'willBlur', // 有4个取值 willFocus即将显示、didFocus完成显示、willBlur即将消失、didBlur消失
            (obj)=>{

                YRRnBridge.gestureEnabled(false);

            }
        )
    }

    componentWillUnmount() {   // 移除监听

        this.viewDidAppear.remove();
        this.viewWillDisappear.remove();

    }


    render() {

        const {navigation} = this.props;
        NavigationUtil.navigation = navigation;
        return (<View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            title={'下拉刷新'}
                            refreshing={this.state.isRefreshing}
                            colors={['rgb(255, 176, 0)', "#ffb100"]}
                            onRefresh={() => {
                                this._onRefresh();
                            }}
                        />
                    }
                >

                    <YRSearchBar
                        value={this.state.inputValue}
                        placeholder="搜索"
                        onSearch={this.onSearch}
                        onSearchChangeText={this.onSearchChangeText}/>
                    <View style={{alignItems: "center", justifyContent: "center"}}>

                        <Text style={{marginBottom: 10}}>Home Screen</Text>
                        <Button
                            title="详情页"
                            onPress={() => {
                                navigation.navigate('Details', {name: '动态的'});
                            }}
                        />
                        <Button
                            title="异步进度条"
                            onPress={() => {
                                navigation.navigate('YRSearchBar', {name: '进度条'});
                            }}
                        />

                        <Button
                            title="自定义对话框"
                            onPress={() => {
                                navigation.navigate('YRModel', {name: '进度条'});
                            }}
                        />
                        <Text style={{marginBottom: 10}}>{this.props.btnText}</Text>
                        <Button title="更新文字"
                                onPress={() => {
                                    this.props.changeText("我的第一个ReactNative项目!");
                                }}/>

                        <Button style={{marginBottom: 10}}
                                title="断点调式" onPress={() => {
                            for (let i = 0; i < 10; i++) {
                                console.log("i*i=", i * i);
                            }
                        }}/>

                        <TouchableHighlight
                            underlayColor="#FF00FF"
                            activeOpacity={1}
                            style={styles.button} onPress={this.loadData.bind(this)}>
                            <Text style={styles.text}> Touch Here </Text>
                        </TouchableHighlight>
                        <Button title="热更新测试"
                                onPress={() => {

                                    NavigationUtil.goPage({name: '热更新'},'CodePushPage');

                                    // navigation.navigate('CodePushPage', {name: '热更新'});

                                }}/>
                        <Button title="图表测试"
                                onPress={() => {

                                    navigation.navigate('EChartsPage', {name: '图表'});

                                }}/>
                    </View>
                </ScrollView>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
        padding: 10,
        margin: 10
    },
    countContainer: {
        alignItems: 'center',
        padding: 10
    },
    countText: {
        color: '#FF00FF'
    },
    text: {
        fontWeight: '600',
        color: '#FFFFFF'
    }
})

const mapStateToProps = state => ({
    btnText: state.pageMainReducer.btnText
})

const mapDispatchToProps = dispatch => ({
    changeText: (text) => {
        dispatch(changeBtnText(text));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)