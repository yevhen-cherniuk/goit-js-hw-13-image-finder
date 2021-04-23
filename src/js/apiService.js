import refs from "./refs.js";
import imageTemplate from '../templates/imageTemplate.hbs';
import { error } from '../../node_modules/@pnotify/core'; 
import * as basicLightbox from '../../node_modules/basiclightbox';
import "../../node_modules/basiclightbox/dist/basicLightbox.min.css";
import '../../node_modules/@pnotify/core/dist/BrightTheme.css';
import "../../node_modules/@pnotify/core/dist/PNotify.css";
import throtle from '../../node_modules/lodash.throttle/index.js'

let count = 0;

const notificationFn = () => { 
    const myNotice = error({
                    title: 'No results!!!!',
                    text: "Please enter another request",
                    delay: 1200,
    });
    count = 0;
}


const renderFn = () => { 
    if (count === refs.pageNumber) { 
        return;
    };
     fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${refs.input.value}&page=${refs.pageNumber}&per_page=12&key=${refs.KEY}`)
        .then(res => res.json())
         .then(({ hits }) => {
             if (hits.length) {
                 refs.gallery.insertAdjacentHTML('beforeend', imageTemplate(hits));
                 refs.pageNumber++;
             }
             else { 
                 notificationFn();
                 return
             }
        }
     )
    
    count = refs.pageNumber;
}

refs.form.addEventListener('submit', e => {
    e.preventDefault();
    refs.gallery.innerHTML = '';
    refs.gallery.classList.add('is-hidden');
    refs.preloadRef.classList.remove('is-hidden');
    renderFn();
    setTimeout(() => {
        refs.preloadRef.classList.add('is-hidden');
        refs.gallery.classList.remove('is-hidden');
    }, 1000);
})


window.addEventListener('scroll', throtle(() => { 
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (clientHeight + scrollTop >= scrollHeight-500) {
            renderFn();
        }
        if (scrollTop > 200) { 
            refs.upBtn.classList.remove('is-hidden')
        }
        if (scrollTop < 200) { 
            refs.upBtn.classList.add('is-hidden')
        }
        }, 300)
);

refs.gallery.addEventListener('click', e => {
    e.path.forEach(el => {
        if (el.className === 'gallery-item') {
            refs.preloadRef.classList.remove('is-hidden');
            const imgBig = el.dataset.img;
            const instance = basicLightbox.create(`<img class='img-lightbox' src=${imgBig}>`);
            instance.show();
            setTimeout(() => {
                refs.preloadRef.classList.add('is-hidden');
                document.querySelector('.basicLightbox').style.opacity = 1;
                document.querySelector('.img-lightbox').style.opacity = 1;
                document.querySelector('.img-lightbox').style.transform = 'scale(1)'; 
                document.querySelector('.img-lightbox').style.transition = 'all 0.6s';
            }, 1200);
        };
                
    });
});