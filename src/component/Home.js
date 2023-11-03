
import Notes from './Notes';
// import Alert from './component/Alert';


function Home(props) {
  const {showAlert} = props
 

  return (
    <div>
      
     <Notes showAlert= {showAlert} />

    </div>
  )
}

export default Home

