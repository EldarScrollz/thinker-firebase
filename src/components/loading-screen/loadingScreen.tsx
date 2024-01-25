import "../loading-screen/loadingScreen.scss";
import PuffLoader from "react-spinners/PuffLoader";

export const LoadingScreen = () =>
{
    return (
        <div className="loading-screen">

            <PuffLoader
                //cssOverride={override}
                size={150}
                color={"#4dbf6b"}
                //loading={this.state.loading}
                //speedMultiplier={1.5}
                //aria-label="Loading Spinner"
                //data-testid="loader"
            />
        </div>
    );
};