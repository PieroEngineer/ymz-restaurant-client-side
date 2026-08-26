import type { Coordinates } from "@/features/profile/types/support/coordinates.type";
import { useState } from "react";


export function useLocation(
    onUpdateLocation: (coordinates: Coordinates) => void,
    onSuccess: () => void
){
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const setViaGoogleLink = async (googleMapsLink: string) => {
        setIsLoading(true)
        setError(null)

        const coordRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;

        // Fast check on short URL
        const initialMatch = googleMapsLink.match(coordRegex);
        if (initialMatch) {
            console.log('There was a fast match');
            onUpdateLocation([parseFloat(initialMatch[1]), parseFloat(initialMatch[2])])
            setError(null)
            setIsLoading(false)
            onSuccess()
            return
        }
        else{
            setIsLoading(false) 
            setError(`Por favor, asegúrese que el link tenga el símbolo "@"`)
        }
        
        // const headers = {
        //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        // };

        // try {    // TODO: The backend should have process the fetch of this for security reasons
        //     // 1. Resolve short link redirect with a 10-second timeout
        //     const response = await fetch(googleMapsLink, {
        //         headers,
        //         redirect: 'follow',
        //         signal: AbortSignal.timeout(10000)
        //     });

        //     // 2. Strategy A: Check final URL string
        //     const finalUrl = response.url;
        //     const urlMatch = finalUrl.match(coordRegex);
        //     if (urlMatch) {
        //         onUpdateLocation([parseFloat(urlMatch[1]), parseFloat(urlMatch[2])])
        //         setIsLoading(false) 
        //         onSuccess()
        //         return
        //     }

        //     // 3. Strategy B: Search raw HTML content
        //     const htmlContent = await response.text();
        //     const htmlRegex = /ll=(-?\d+\.\d+),(-?\d+\.\d+)/;
        //     const htmlMatch = htmlContent.match(htmlRegex);

        //     if (htmlMatch) {
        //         onUpdateLocation([parseFloat(htmlMatch[1]), parseFloat(htmlMatch[2])])
        //         setIsLoading(false) 
        //         onSuccess()
        //         return
        //     }

        //     setError(null)
        //     setIsLoading(false)

        // } catch (error) {
        //     console.error(`Error processing link: ${error}`);
        //     setIsLoading(false) 
        //     setError(`Error processing link: ${error}`)
        // }
    }

    const setViaBrowser = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser');
            setIsLoading(false) 
            return;
        }

        setIsLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
        (position) => {
            onUpdateLocation([position.coords.latitude, position.coords.longitude]);
            setError(null); 
            setIsLoading(false);
            onSuccess()
        },
        (error) => {
            setIsLoading(false);
            setError(mapGeolocationError(error));
        },
        {
            enableHighAccuracy: true, // prefer GPS on devices that have it, at the cost of more battery/time
            timeout: 10000,
            maximumAge: 0, // don't accept a cached position for this action — restaurant setup needs current, precise location
        }
        );
    }

    return {        
        isLoading,
        
        error,
        
        setViaGoogleLink,
        
        setViaBrowser
    }

}

function mapGeolocationError(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location access was denied. Please enable it in your browser settings.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable right now.';
    case error.TIMEOUT:
      return 'Getting your location took too long. Please try again.';
    default:
      return 'Could not get your location.';
  }
}