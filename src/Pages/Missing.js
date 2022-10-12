
import NotFound from '../assets/img/404.svg';
import ErrorLoading from '../assets/img/Error.svg';
const Missing = ({error}) => {

const styles= {
  NotFound: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

  },
  error: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#98a3a2',
  
    minHeight: '100vh'

  }
}

  return (  
    <>

    {!error && 
    <div style={styles.NotFound}>
    
    <img src={NotFound} alt='404 not found' height='60%' width='100%'/>
    </div>
    }

    {error && 
      <div style={styles.error}>
        <img src={ErrorLoading} alt='System Error' height='60%' width='60%'/>
      </div>
    
    }
    </>
  )
}

export default Missing