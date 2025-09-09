import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    
    margin:{
      margin: 20
    },

    p:{
      padding:20
    },

    header: {
        backgroundColor: '#000099',
        padding: 10,
        paddingTop: 50,
        paddingBottom: 40,
        flexDirection: 'row',
        alignItems: 'center',
    
      },
      headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        flex:1,
        textAlign:'center'
        
      },

      headerIcon:{
        color: 'white',
        fontSize: 30,
        marginLeft: 10
      },

      orText: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 14,
        color: '#666',
      },
      
      socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20, 
      },
      
      socialButton: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: '#f5f5f5',
        elevation: 2, 
        borderWidth: 2,        
        borderColor: '#000099', 
      },
      
      socialIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
      },
      

      background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      box: {
        width: '85%',
        padding: 25,
        borderWidth: 2,
        borderColor: '#000099',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.7)',
        alignItems: 'center',
      },
      box1: {
        width: '100%',
        padding: 25,
        borderWidth: 2,
        borderColor: '#000099',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.7)',
        alignItems: 'center',
      },
      logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
        resizeMode: 'contain',
        borderRadius: 50,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000099',
        marginBottom: 5,
      },
      subtitle: {
        fontSize: 14,
        color: '#333',
        marginBottom: 20,
      },
      registerButton: {
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#000099',
        borderRadius: 25,
        paddingVertical: 12,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
      },
      registerText: {
        color: '#000099',
        fontWeight: '600',
        fontSize: 16,
      },
      loginButton: {
        backgroundColor: '#000099',
        borderRadius: 25,
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
      },
      loginText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
      },
      tick: {
        width: 20,
        height: 20,
        margin: 0,
        padding: 0,
        backgroundColor: '#ffffff', // nền trắng cho ô vuông
        borderWidth: 1,             // viền ô
        borderColor: '#000099',     // màu viền
        borderRadius: 3
      },
      picker: {
        backgroundColor: 'white', 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: '#000099', 
        marginBottom: 10 

      },

            // --- BẮT ĐẦU: style Home mới ---
      topContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 60, // cách status bar
      paddingBottom: 20,
      width: '100%',
      backgroundColor: 'transparent', // trong suốt để hiện background
    },

      boxWhite: {                           // Chỗ này là box trắng phía dưới giống form đăng ký/đăng nhập
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingVertical: 20,
        paddingHorizontal: 15,
      },

      title1: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'black',    // tạo viền/đổ bóng
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        marginBottom: 5,
      },
      
      subtitle1: {
        fontSize: 16,
        color: 'white',
        marginBottom: 2,
      },
    


      activityTitle: {                       // Tiêu đề cho section Gợi ý hoạt động
        color: '#000099',
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: 'bold',
      },
      // --- KẾT THÚC: style Home mới ---

      featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        
      },
      featureItem: {
        alignItems: 'center',
        width: '25%',
        marginVertical: 15,
      },
      iconCircle: {
        backgroundColor: '#DDDDDD',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000099',
        borderWidth:1,
        color:'#000099',
        fontSize:30
      },
      featureText: {
        marginTop: 5,
        fontSize: 14,
        textAlign: 'center',
        color: '#424242',
      },
      bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#000099',
        backgroundColor: 'white',
        position: 'absolute', 
        bottom: 0,
        left: 0,
        right: 0,
      },
      navItem: {
        alignItems: 'center',
        
      },
      navText: {
        fontSize: 12,
        color: '#757575',
      },

      callIcon:{
        alignItems: 'center',
        padding: 20,
        paddingBottom:20,
        backgroundColor: '#000099',
        borderRadius: 50,
        borderColor: 'white',
        borderWidth:1,
        color:'white'
      },

      featureHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        marginVertical: 10,
        color: '#000099',
      },
      featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      sectionTitle: {
        color: '#000099',
        textAlign: 'center',
        margin: 20,
        fontWeight: 'bold',
      },

      section: {
        marginBottom: 24,
        paddingHorizontal: 16,
      },
      card: {
        marginBottom: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        elevation: 2,
      },
      chatButton: {
        marginTop: 10,
        borderColor: '#000099',
        color: '#000099'
      },
      roleButtons: {
        flexDirection: 'column',
        gap: 10,
      },
      roleButton: {
        padding: 12,
        backgroundColor: '#E1F5FE',
        borderRadius: 8,
        marginVertical: 6,
      },
      roleText: {
        textAlign: 'center',
        fontWeight: '500',
        color: 'white',
      },
      faqItem: {
        fontSize: 14,
        color: '#444',
        marginBottom: 4,
      },
      footer: {
        borderTopWidth: 1,
        borderTopColor: '#000099',
        paddingTop: 12,
        marginTop: 16,
        paddingHorizontal: 16,
      },
      footerText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#888',
        marginBottom: 4,
      },
      // footer: {
      //   alignItems: 'center',
      //   marginTop: 20,
      //   marginBottom: 30,
      // },
      // footerText: {
      //   color: '#757575',
      //   fontSize: 14,
      // },
    
      

    });