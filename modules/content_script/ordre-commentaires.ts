interface IComment {
    id: number,
    author: string,
    content: string,
    date: string,
    iconUrl: string,
    authorType: string,
    authorClass: string
}


const getImageURL = (hCommentaire: Element): string => {
    let hIcon: Element;
    if (hCommentaire.closest('.subcomments-container')) {
        // Sous-commentaire
        hIcon = hCommentaire.querySelector('.comment-expend > img.avatar');
    } else {
        // Commentaire de niveau 1
        hIcon = hCommentaire.parentNode.parentNode.querySelector('.comment-expend > img.avatar');
    }
    return hIcon?.getAttribute('src');

}

const getAuthorType = (hCommentaire: Element): string => {
    const hAuthorType = hCommentaire.querySelector('.author-tag');
    return hAuthorType.textContent;
}

const getContent = (hCommentaire: Element): string => {
    const hcontent = hCommentaire.querySelector('.comment-content');
    return hcontent.innerHTML;
}

const getDate = (hCommentaire: Element): string => {
    const hDate = hCommentaire.querySelector('.ago');
    return hDate.textContent;
}

const getAuthor = (hCommentaire: Element): string => {
    const hAuthor = hCommentaire.querySelector('.pseudo-comment');
    return hAuthor.textContent;
}

const getAuthorClass = (hCommentaire: Element): string => {
    const hAuthor = hCommentaire.querySelector('.author-tag');
    return hAuthor.classList.item(1);
}

const getCommentairesFromDOM: () => IComment[] = () => {
    const hCommentaires = document.querySelectorAll('.comment');
    const list: IComment[] = [];

    for(let i = 0; i < hCommentaires.length; i++) {
        const hCommentaire = hCommentaires[i];        
        const commentaire: IComment = {
            id: getID(hCommentaire),
            iconUrl: getImageURL(hCommentaire),
            authorType: getAuthorType(hCommentaire),
            content: getContent(hCommentaire),
            date: getDate(hCommentaire), 
            author: getAuthor(hCommentaire),
            authorClass: getAuthorClass(hCommentaire)
        }

        list.push(commentaire);
    }

    return list;
};

const ordreCommentairesState: {
    ordre: string;
    initialDOM: Element;
    currentDOM: Element;
    container: Element;    
    commentaires: IComment[];
  } = {
    ordre: 'default',
    initialDOM: document.querySelector('#comment-page > .comments-list'),
    currentDOM: document.querySelector('#comment-page > .comments-list'),
    container: document.querySelector('#comment-page'),
    commentaires: getCommentairesFromDOM()
};


const sortCommentairesOrdreChronologique = (commentaires: IComment[]) => {
    return commentaires.sort((a, b) => {            
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
      return 0;
    });  
  };

const sortCommentairesOrdreAnteChronologique = (commentaires: IComment[]) => {
    return commentaires.sort((a, b) => {            
      if (a.id < b.id) return 1;
      if (a.id > b.id) return -1;
      return 0;
    });  
  };

const createDOMForCommentaire = (commentaire: IComment) => {
    const div = document.createElement('div');
    
    div.innerHTML = `
<div class="comment byuser depth-1 single-comment" id="comment-${commentaire.id}">
    <div class="comment-expend">
        <img alt="" src="${commentaire.iconUrl}" srcset="${commentaire.iconUrl} 2x" class="avatar avatar-30 photo ls-is-cached lazyloaded" height="30" width="30" decoding="async">    <div class="vertical-separator nothing-ever-to-hide" hiding-things="0" cid="${commentaire.id}">
    </div>
</div>

<div class="comment-main">
    <div class="comment-info-pseudo">
        <div>
            <span class="pseudo-comment">${commentaire.author}</span>
            <span class="author-tag ${commentaire.authorClass}">${commentaire.authorType}</span>                    
        </div>

    <div class="ago ago-${commentaire.id}">${commentaire.date}</div>
</div>

<div>
    <div class="comment-content" id="comment-content-${commentaire.id}">
        <div class="comment-text-content">${commentaire.content}</div>
        <div style="display:none;" class="add-comment" id="editor-wrap-${commentaire.id}">
    </div>

    <div class="editor-wrap" id="editor-subwrap-${commentaire.id}"></div>
</div>

<div class="button-reply-and-edit">
    <div class="reply-and-edit" id="reply-and-edit-${commentaire.id}">
        <div class="reply" id="reply-${commentaire.id}" cid="${commentaire.id}">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.9299 13.0035C14.5949 12.3755 15.1305 11.6089 15.4815 10.7685C15.8417 9.9188 16.0171 9.01371 15.9987 8.09014C15.9987 4.28506 12.7385 1.18188 8.56399 1.18188C4.38948 1.18188 1 4.28506 1 8.09014C1 11.8952 4.38948 14.9984 8.57322 14.9984C9.31208 14.9984 10.0509 14.8968 10.7713 14.7029C10.9837 14.8876 11.2146 15.0631 11.464 15.2201C12.443 15.8573 13.4958 16.1806 14.6041 16.1806C14.8073 16.1806 14.9735 16.079 15.0474 15.9127C15.0844 15.8388 15.1028 15.7557 15.0936 15.6634C15.0936 15.5802 15.0566 15.4971 15.0105 15.4325C14.4748 14.7121 14.1054 13.8717 13.9391 12.985V13.0035H13.9299Z" stroke="#6B6B6B" style="" stroke-width="1.5" stroke-linejoin="round"></path>
            </svg>
            <span class="reply-button">Répondre</span>
        </div>        
    </div>
</div>
`
    return div;
}

const createDOM = (commentaires: IComment[]) => {
    const divCommentsList = document.createElement('div');

    divCommentsList.classList.add('comments-list');

    for(let i = 0; i < commentaires.length; i++) {
        const commentaire = commentaires[i];
        const divCommentaire = createDOMForCommentaire(commentaire);
        divCommentsList.appendChild(divCommentaire);
    }

    return divCommentsList;
}

const ordreChronologique = () => {
    const commentaires = [...ordreCommentairesState.commentaires];
    let newDOM;

    sortCommentairesOrdreChronologique(commentaires);
    newDOM = createDOM(commentaires);

    ordreCommentairesState.container.replaceChild(newDOM, ordreCommentairesState.currentDOM);
    ordreCommentairesState.currentDOM = newDOM;
}


const ordreAnteChronologique = () => {
    const commentaires = [...ordreCommentairesState.commentaires];
    let newDOM;

    sortCommentairesOrdreAnteChronologique(commentaires);
    newDOM = createDOM(commentaires);

    ordreCommentairesState.container.replaceChild(newDOM, ordreCommentairesState.currentDOM);
    ordreCommentairesState.currentDOM = newDOM;
}

const defaultOrder = () => {
    ordreCommentairesState.container.replaceChild(ordreCommentairesState.initialDOM, ordreCommentairesState.currentDOM);
    ordreCommentairesState.currentDOM = ordreCommentairesState.initialDOM;
}

const setOrdreCommentaires = (ordre: string) => {
    if (ordreCommentairesState.container) {
        switch(ordre) {
            case 'chronologique':
                ordreChronologique();
                break;
            case 'antechronologique':
                ordreAnteChronologique();
                break;
            default:
                defaultOrder();
        }
    }
}
